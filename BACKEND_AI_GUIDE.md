# Backend Dependency Guide: Audio & AI Services

The SmartHire backend is currently running on **Python 3.13**, which is compatible with core services (FastAPI, LanceDB, Ollama) but has known limitations with specific AI packages.

## Audio Features (TTS/STT)
The following packages currently do not support Python 3.13:
- `kokoro-onnx` (Text-to-Speech)
- `moonshine-onnx` (Speech-to-Text)

### How to Resolve
To enable full voice interaction, it is recommended to use **Python 3.10, 3.11, or 3.12**.

1. **Install Python 3.12** from [python.org](https://www.python.org/downloads/).
2. **Create a virtual environment**:
   ```bash
   py -3.12 -m venv venv
   .\venv\Scripts\activate
   ```
3. **Install all dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

## Model Assets
I have placed the following assets in `backend/app/models/`:
- `kokoro-v0_19.onnx`: Downloaded.
- `voices.json`: Downloaded.

*Note: Moonshine-ONNX also requires model files (preprocessor and encoder/decoder) which are typically downloaded automatically by the package or can be manually placed in the models folder.*
