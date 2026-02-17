import logging
import numpy as np
import soundfile as sf
import io
import os
import onnxruntime as ort

try:
    from kokoro_onnx import Kokoro
except ImportError:
    Kokoro = None

try:
    import sherpa_onnx
except ImportError:
    sherpa_onnx = None

logger = logging.getLogger(__name__)

class VoiceService:
    def __init__(self, models_dir="app/models"):
        self.tts = None
        self.stt = None
        
        kokoro_path = os.path.join(models_dir, "kokoro-v0_19.onnx")
        # kokoro-onnx 0.5.0 uses voices.bin
        voices_path = os.path.join(models_dir, "voices.bin")
        moonshine_dir = os.path.join(models_dir, "sherpa-onnx-moonshine-tiny-en-int8")

        # Initialize TTS (Kokoro)
        if Kokoro and os.path.exists(kokoro_path) and os.path.exists(voices_path):
            try:
                # Force CPU provider to avoid onnxruntime auto-detection issues
                sess = ort.InferenceSession(kokoro_path, providers=['CPUExecutionProvider'])
                self.tts = Kokoro.from_session(sess, voices_path)
                logger.info("✔ Kokoro (TTS) initialized successfully")
            except Exception as e:
                logger.warning(f"Failed to initialize Kokoro (TTS): {e}")

        # Initialize STT (Sherpa-ONNX Moonshine)
        if sherpa_onnx and os.path.exists(moonshine_dir):
            try:
                self.stt = sherpa_onnx.OfflineRecognizer.from_moonshine(
                    preprocessor=os.path.join(moonshine_dir, "preprocess.onnx"),
                    encoder=os.path.join(moonshine_dir, "encode.int8.onnx"),
                    uncached_decoder=os.path.join(moonshine_dir, "uncached_decode.int8.onnx"),
                    cached_decoder=os.path.join(moonshine_dir, "cached_decode.int8.onnx"),
                    tokens=os.path.join(moonshine_dir, "tokens.txt"),
                )
                logger.info("✔ Sherpa-ONNX (Moonshine STT) initialized")
            except Exception as e:
                logger.warning(f"Failed to initialize Sherpa-ONNX (STT): {e}")

    def speak(self, text: str, voice="af_heart") -> bytes:
        if not self.tts:
            logger.error("TTS engine not initialized")
            return b""
            
        try:
            samples, sample_rate = self.tts.create(text, voice=voice, speed=1.0)
            buffer = io.BytesIO()
            sf.write(buffer, samples, sample_rate, format='WAV')
            return buffer.getvalue()
        except Exception as e:
            logger.error(f"Error in speak: {e}")
            return b""

    def listen(self, audio_bytes: bytes) -> str:
        if not self.stt:
            return "[STT Engine Not Loaded]"
            
        try:
            audio_data, sample_rate = sf.read(io.BytesIO(audio_bytes), dtype="float32")
            stream = self.stt.create_stream()
            stream.accept_waveform(sample_rate, audio_data)
            self.stt.decode_stream(stream)
            return stream.result.text
        except Exception as e:
            logger.error(f"Error in listen: {e}")
            return ""

voice_service = VoiceService()
