import os
import logging
from typing import Dict, Any, List, Optional
from app.services.cv_engine import cv_engine

logger = logging.getLogger(__name__)

# Constants
UPLOAD_DIR = "/tmp/sentinel_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class SentinelIdentityService:
    def __init__(self):
        # session_id -> metadata
        self.active_verification_sessions: Dict[str, Dict[str, Any]] = {}

    def initiate_handshake(self, candidate_id: str, session_id: str) -> Dict[str, Any]:
        """Starts the identity handshake process."""
        self.active_verification_sessions[session_id] = {
            "candidate_id": candidate_id,
            "status": "pending",
            "id_card_path": None,
            "profile_photo_path": None,
            "challenges": ["look_center", "turn_left", "turn_right"],
            "current_challenge_index": 0,
            "captured_angles": {} # Stores path for each successful angle
        }
        return {
            "session_id": session_id,
            "first_challenge": "look_center",
            "message": "Initiate 3-axis biometric scan."
        }

    async def verify_handshake(self, session_id: str, frame: Any) -> Dict[str, Any]:
        """Verifies if the current frame satisfies the current liveness challenge."""
        if session_id not in self.active_verification_sessions:
            return {"verified": False, "error": "Session expired or invalid"}

        session = self.active_verification_sessions[session_id]
        challenges: List[str] = session["challenges"]
        current_idx: int = session["current_challenge_index"]
        
        if current_idx >= len(challenges):
             return await self.perform_final_cross_verification(session_id)

        target_challenge = challenges[current_idx]

        # Verify current rotation/action
        is_valid = cv_engine.check_liveness_action(frame, target_challenge)
        if not is_valid:
            return {
                "verified": False, 
                "status": "waiting",
                "error": f"Align head to {target_challenge.replace('_', ' ')}",
                "current_challenge": target_challenge
            }

        # Save this frame as a reference for this angle
        angle_path = os.path.join(UPLOAD_DIR, f"{session_id}_{target_challenge}.jpg")
        import cv2
        cv2.imwrite(angle_path, frame)
        session["captured_angles"][target_challenge] = angle_path

        # Progress to next challenge
        if current_idx < len(challenges) - 1:
            session["current_challenge_index"] += 1
            next_challenge = challenges[session["current_challenge_index"]]
            return {
                "verified": False,
                "status": "progressing",
                "next_challenge": next_challenge
            }
        
        # All angles captured! Mark sessions as ready for verification or just run it
        session["current_challenge_index"] += 1 # Move beyond list
        return await self.perform_final_cross_verification(session_id)

    async def perform_final_cross_verification(self, session_id: str) -> Dict[str, Any]:
        """Cross-matches ID, Profile Photo, and Live Frame."""
        session = self.active_verification_sessions.get(session_id)
        if not session:
            return {"verified": False, "error": "Session gone"}

        if not session["profile_photo_path"] or not session["id_card_path"]:
            return {"verified": False, "error": "Waiting for ID and Profile photo uploads."}

        # 1. Compare Reference Profile Photo vs Gov ID
        id_match = cv_engine.verify_identity(
            session["id_card_path"], 
            session["profile_photo_path"]
        )
        
        # 2. Compare Central Rotation Frame vs Profile Photo (Tamper Check)
        center_frame_path = session["captured_angles"].get("look_center")
        if not center_frame_path:
             return {"verified": False, "error": "Live center frame missing"}
             
        center_match = cv_engine.verify_identity(
            session["profile_photo_path"],
            center_frame_path
        )

        id_similarity = id_match.get("similarity", 0)
        center_similarity = center_match.get("similarity", 0)
        
        # Strict threshold: ID vs Profile (60% since IDs are hard), Profile vs Live (75%)
        id_verified = id_similarity >= 0.6
        biometric_verified = center_similarity >= 0.75

        overall_verified = id_verified and biometric_verified
        avg_confidence = (id_similarity + center_similarity) / 2

        if overall_verified:
            session["status"] = "verified"
            return {
                "verified": True,
                "confidence": avg_confidence,
                "message": "Identity verified with 180-biometrics."
            }

        error_msg = "Verification failed."
        if not id_verified:
            error_msg = "Face on ID does not match profile photo."
        elif not biometric_verified:
            error_msg = "Live biometrics do not match profile photo."

        return {
            "verified": False,
            "error": error_msg,
            "confidence": avg_confidence
        }

sentinel_identity = SentinelIdentityService()
