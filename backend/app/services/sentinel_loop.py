import logging
import time
from typing import Dict, List, Any
from app.services.cv_engine import cv_engine

logger = logging.getLogger(__name__)

class SentinelLoopService:
    def __init__(self):
        # Store state for active proctoring sessions
        # { session_id: { yellow_flags: int, red_flags: int, ... } }
        self.active_sessions = {}

    def process_frame(self, session_id: str, frame: Any) -> Dict[str, Any]:
        """
        Processes a single video frame for live proctoring:
        - Gaze tracking
        - Environment scan (Object detection)
        """
        if session_id not in self.active_sessions:
            self.active_sessions[session_id] = {
                "yellow_flags": 0,
                "red_flags": 0,
                "off_screen_duration": 0,
                "last_processed_time": time.time(),
                "logs": []
            }

        session = self.active_sessions[session_id]
        now = time.time()
        dt = now - session["last_processed_time"]
        session["last_processed_time"] = now

        response = {"status": "clean", "alerts": []}

        # 1. Gaze Tracking
        gaze = cv_engine.track_gaze(frame)
        if gaze == "off":
            session["off_screen_duration"] += dt
            if session["off_screen_duration"] > 3.0:
                session["yellow_flags"] += 1
                session["off_screen_duration"] = 0 # Reset after flagging
                alert = {"type": "yellow_flag", "reason": "User looking away (>3s)"}
                response["alerts"].append(alert)
                session["logs"].append({"timestamp": now, **alert})
        else:
            session["off_screen_duration"] = 0

        # 2. Environment Scan (Object Detection)
        # Note: Frequency control happens in the WebSocket router (every 30th frame)
        detections = cv_engine.detect_objects(frame)
        for obj in detections:
            if obj["label"] in ["cell phone", "book"]:
                session["red_flags"] += 1
                alert = {"type": "red_flag", "reason": f"Unauthorized object detected: {obj['label']}"}
                response["alerts"].append(alert)
                session["logs"].append({"timestamp": now, **alert})
            elif obj["label"] == "person":
                # Check for multiple people
                pass 

        if response["alerts"]:
            response["status"] = "warning"
            
        return {
            **response,
            "session_summary": {
                "yellow_flags": session["yellow_flags"],
                "red_flags": session["red_flags"]
            }
        }

    def log_focus_event(self, session_id: str, event_type: str):
        """Logs tab focus/visibility change events."""
        if session_id in self.active_sessions:
            now = time.time()
            alert = {"type": "warning", "reason": f"Tab visibility change: {event_type}"}
            self.active_sessions[session_id]["logs"].append({"timestamp": now, **alert})
            self.active_sessions[session_id]["yellow_flags"] += 1
            logger.warning(f"Sentinel: Session {session_id} focus lost")

sentinel_loop = SentinelLoopService()
