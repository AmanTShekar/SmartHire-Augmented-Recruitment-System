import onnxruntime as ort
import json
import os
import sys

model_path = "app/models/kokoro-v0_19.onnx"
voices_path = "app/models/voices.json"

print(f"Checking {model_path}...")
if not os.path.exists(model_path):
    print("Model file missing!")
else:
    try:
        sess = ort.InferenceSession(model_path)
        print("✔ ONNX Runtime loaded model successfully.")
    except Exception as e:
        print(f"✘ ONNX Runtime failed to load model: {e}")

print(f"Checking {voices_path}...")
if not os.path.exists(voices_path):
    print("Voices file missing!")
else:
    try:
        with open(voices_path, 'r') as f:
            v = json.load(f)
        print("✔ JSON loaded voices successfully.")
    except Exception as e:
        print(f"✘ JSON failed to load voices: {e}")

print("Attempting Kokoro init...")
try:
    from kokoro_onnx import Kokoro
    tts = Kokoro(model_path, voices_path)
    print("✔ Kokoro initialized successfully.")
except Exception as e:
    print(f"✘ Kokoro initialization failed: {e}")
    import traceback
    traceback.print_exc()
