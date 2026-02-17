import logging

logger = logging.getLogger(__name__)

class AIManager:
    def __init__(self):
        self.vision = None
        self.audio = None
        self.brain = None
        
        # In a more advanced setup, we would initialize services here
        # For now, we rely on individual service instances or keep them as None
        # to prevent application crashes when packages are missing.
        try:
            from app.services.voice import voice_service
            self.audio = voice_service
            # Note: voice_service matches the expected interface for .transcribe()
            # if we adapt it or if it already has it.
        except ImportError:
            pass

ai_manager = AIManager()
