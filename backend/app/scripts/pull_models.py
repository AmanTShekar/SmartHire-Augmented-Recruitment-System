import os
import time
import logging
from ollama import Client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def pull_models():
    host = os.getenv("OLLAMA_HOST", "http://ollama:11434")
    client = Client(host=host)
    
    models = ["phi3.5", "llama3.2", "nomic-embed-text"]
    
    # Wait for Ollama to be ready
    max_retries = 30
    for i in range(max_retries):
        try:
            client.list()
            logger.info("✔ Ollama is ready")
            break
        except Exception:
            if i < max_retries - 1:
                logger.info(f"Waiting for Ollama ({i+1}/{max_retries})...")
                time.sleep(2)
            else:
                logger.error("✖ Could not connect to Ollama after 30 retries")
                return

    # Check and pull models - handle potential attribute/dict differences in SDK versions
    try:
        resp = client.list()
        # Handle both object-based and dict-based responses
        if hasattr(resp, 'models'):
            existing_models = [m.model for m in resp.models]
        else:
            existing_models = [m.get('model') or m.get('name') for m in resp.get('models', [])]
            
        for model in models:
            if not any(model in m for m in existing_models if m):
                logger.info(f"Pulling model: {model}...")
                client.pull(model)
                logger.info(f"✔ Successfully pulled {model}")
            else:
                logger.info(f"✔ Model {model} already exists")
    except Exception as e:
        logger.error(f"Error pulling models: {e}")

if __name__ == "__main__":
    pull_models()
