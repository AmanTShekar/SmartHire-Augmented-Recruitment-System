import os
import requests
import tarfile
import logging
import shutil

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
MOONSHINE_DIR = os.path.join(MODELS_DIR, "sherpa-onnx-moonshine-tiny-en-int8")

KOKORO_MODEL_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/kokoro-v0_19.onnx"
# Version 0.5.0 of kokoro-onnx uses voices.bin (numpy format)
VOICES_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/voices.bin"
MOONSHINE_URL = "https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-moonshine-tiny-en-int8.tar.bz2"

def download_file(url, target_path, force=False):
    if os.path.exists(target_path) and not force:
        logger.info(f"✔ File/Archive already exists: {target_path}")
        return True

    if os.path.exists(target_path) and force:
        logger.info(f"Removing existing file to force download: {target_path}")
        os.remove(target_path)

    logger.info(f"Downloading {url} to {target_path}...")
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with open(target_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
                
        logger.info(f"✔ Download complete: {target_path}")
        return True
    except Exception as e:
        logger.error(f"Failed to download {url}: {e}")
        return False

def extract_tar(tar_path, extract_path):
    logger.info(f"Extracting {tar_path} to {extract_path}...")
    try:
        if not tarfile.is_tarfile(tar_path):
            logger.error(f"Not a valid tar file: {tar_path}")
            return False
            
        with tarfile.open(tar_path, "r:bz2") as tar:
            tar.extractall(path=extract_path)
            
        logger.info(f"✔ Extraction complete")
        return True
    except Exception as e:
        logger.error(f"Failed to extract {tar_path}: {e}")
        return False

def main():
    if not os.path.exists(MODELS_DIR):
        os.makedirs(MODELS_DIR)
        logger.info(f"Created directory: {MODELS_DIR}")

    # Kokoro - Ensure we have the .onnx and the .bin voices
    download_file(KOKORO_MODEL_URL, os.path.join(MODELS_DIR, "kokoro-v0_19.onnx"))
    download_file(VOICES_URL, os.path.join(MODELS_DIR, "voices.bin"))

    # Moonshine - check for critical files
    files_needed = ["encode.int8.onnx", "preprocess.onnx", "tokens.txt", "uncached_decode.int8.onnx"]
    moonshine_missing = any(not os.path.exists(os.path.join(MOONSHINE_DIR, f)) for f in files_needed)

    tar_path = os.path.join(MODELS_DIR, "sherpa-onnx-moonshine-tiny-en-int8.tar.bz2")

    if moonshine_missing:
        logger.info("Some Moonshine files are missing. Attempting re-download.")
        if download_file(MOONSHINE_URL, tar_path, force=True):
            if not extract_tar(tar_path, MODELS_DIR):
                logger.error("Extraction failed. Deleting corrupted archive.")
                if os.path.exists(tar_path):
                    os.remove(tar_path)
            else:
                 if any(not os.path.exists(os.path.join(MOONSHINE_DIR, f)) for f in files_needed):
                      logger.error("Extraction seemingly succeeded but files are missing!")
                 else:
                      logger.info("✔ Moonshine files successfully extracted.")
    else:
        logger.info(f"✔ Moonshine models verified in: {MOONSHINE_DIR}")

if __name__ == "__main__":
    main()
