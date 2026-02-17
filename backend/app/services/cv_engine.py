import cv2
import numpy as np
import logging
from typing import Dict, Any, List, Optional, Union
import os

try:
    import mediapipe as mp
except ImportError:
    mp = None

try:
    from deepface import DeepFace
except ImportError:
    DeepFace = None

try:
    from ultralytics import YOLO
except ImportError:
    YOLO = None

logger = logging.getLogger(__name__)

class CVEngine:
    def __init__(self):
        self.yolo_model = None
        self.face_mesh = None
        
        # Initialize MediaPipe Face Mesh for gaze and liveness
        if mp:
            try:
                self.mp_face_mesh = mp.solutions.face_mesh
                self.face_mesh = self.mp_face_mesh.FaceMesh(
                    static_image_mode=False,
                    max_num_faces=1,
                    refine_landmarks=True,
                    min_detection_confidence=0.5,
                    min_tracking_confidence=0.5
                )
                logger.info("✔ MediaPipe Face Mesh initialized")
            except Exception as e:
                logger.error(f"Failed to initialize MediaPipe Face Mesh: {e}")

        # Initialize YOLOv8-nano for object detection
        if YOLO:
            try:
                # Load YOLOv8n (nano)
                self.yolo_model = YOLO("yolov8n.pt")
                logger.info("✔ YOLOv8-nano initialized")
            except Exception as e:
                logger.error(f"Failed to load YOLO model: {e}")

    def verify_identity(self, img1_path: str, img2_path: str) -> Dict[str, Any]:
        """Compares two images using DeepFace."""
        if not DeepFace:
            return {"verified": False, "confidence": 0, "error": "DeepFace not installed"}
        
        if not os.path.exists(img1_path) or not os.path.exists(img2_path):
            return {"verified": False, "confidence": 0, "error": "Image paths not found"}

        try:
            result = DeepFace.verify(
                img1_path=img1_path,
                img2_path=img2_path,
                model_name="VGG-Face",
                enforce_detection=True,
                detector_backend="opencv"
            )
            similarity = 1 - result["distance"]
            return {
                "verified": result["verified"],
                "distance": result["distance"],
                "threshold": result["threshold"],
                "similarity": similarity
            }
        except Exception as e:
            logger.error(f"DeepFace verification failed: {e}")
            return {"verified": False, "confidence": 0, "error": str(e)}

    def get_head_pose(self, frame: np.ndarray) -> Dict[str, Any]:
        """Calculates head rotation (yaw, pitch) using landmarks."""
        if not self.face_mesh:
            return {"yaw": 0, "pitch": 0, "detected": False}
            
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)
        
        if not results.multi_face_landmarks:
            return {"yaw": 0, "pitch": 0, "detected": False}
            
        landmarks = results.multi_face_landmarks[0].landmark
        img_h, img_w, _ = frame.shape
        
        # 3D relative points
        face_3d = []
        face_2d = []
        
        # Indices: 33 (L eye corner), 263 (R eye corner), 1 (Nose), 61 (L mouth), 291 (R mouth), 199 (Chin)
        for idx in [33, 263, 1, 61, 291, 199]:
            lm = landmarks[idx]
            face_2d.append([lm.x * img_w, lm.y * img_h])
            face_3d.append([lm.x * img_w, lm.y * img_h, lm.z * img_w]) # z-projection
            
        face_2d = np.array(face_2d, dtype=np.float64)
        face_3d = np.array(face_3d, dtype=np.float64)
        
        focal_length = 1 * img_w
        cam_matrix = np.array([[focal_length, 0, img_h / 2],
                              [0, focal_length, img_w / 2],
                              [0, 0, 1]])
        dist_matrix = np.zeros((4, 1), dtype=np.float64)
        
        success, rot_vec, trans_vec = cv2.solvePnP(face_3d, face_2d, cam_matrix, dist_matrix)
        rmat, _ = cv2.Rodrigues(rot_vec)
        angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)
        
        return {
            "yaw": angles[1] * 360,
            "pitch": angles[0] * 360,
            "detected": True
        }

    def check_liveness_action(self, frame: np.ndarray, action: str) -> bool:
        """Verifies if the user is in the correct pose."""
        pose = self.get_head_pose(frame)
        if not pose["detected"]:
            return False
            
        yaw = pose["yaw"]
        if action == "look_center":
            return -15 <= yaw <= 15
        if action == "turn_left":
            return yaw < -20
        if action == "turn_right":
            return yaw > 20
        return False

    def track_gaze(self, frame: np.ndarray) -> str:
        """Simplified gaze tracking."""
        pose = self.get_head_pose(frame)
        if not pose["detected"]:
            return "off"
        yaw = pose["yaw"]
        pitch = pose["pitch"]
        if abs(yaw) > 25 or abs(pitch) > 25:
            return "off"
        return "center"

    def detect_objects(self, frame: np.ndarray) -> List[Dict[str, Any]]:
        """Detects objects using YOLO."""
        if not self.yolo_model:
            return []
            
        try:
            results = self.yolo_model(frame, verbose=False)
            detections = []
            target_classes = {0: "person", 67: "cell phone", 73: "book"}
            
            for r in results:
                for box in r.boxes:
                    cls_id = int(box.cls[0])
                    if cls_id in target_classes:
                        detections.append({
                            "label": target_classes[cls_id],
                            "confidence": float(box.conf[0])
                        })
            return detections
        except Exception as e:
            logger.error(f"YOLO detection error: {e}")
            return []

cv_engine = CVEngine()
