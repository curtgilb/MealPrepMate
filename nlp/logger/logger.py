import logging
import os

# Create logs directory if it doesn't exist
log_dir = "./logs"
os.makedirs(log_dir, exist_ok=True)

# Configure root logger
logging.basicConfig(
    level=logging.WARNING,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        # File handler
        logging.FileHandler(f"{log_dir}/application.log"),
        # Optional: Keep console output too
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("nlp-service")
