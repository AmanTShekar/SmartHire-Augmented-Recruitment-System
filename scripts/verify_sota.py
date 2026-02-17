import sys
import os

print("Verifying SOTA AI Stack...")

# 1. Check Vision (MediaPipe)
try:
    import mediapipe as mp
    print("✅ MediaPipe Installed")
except ImportError as e:
    print(f"❌ MediaPipe Failed: {e}")

# 2. Check Audio (Faster-Whisper)
try:
    from faster_whisper import WhisperModel
    print("✅ Faster-Whisper Installed")
except ImportError as e:
    print(f"❌ Faster-Whisper Failed: {e}")

# 3. Check NLP (Sentence-Transformers)
try:
    from sentence_transformers import SentenceTransformer
    print("✅ Sentence-Transformers Installed")
except ImportError as e:
    print(f"❌ Sentence-Transformers Failed: {e}")
