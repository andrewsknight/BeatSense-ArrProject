import os

APP_VERSION = "0.0.1"
APP_NAME = "Text Sentiment Analysis Prediction"
API_PREFIX = "/api"

IS_DEBUG = os.getenv("IS_DEBUG", False)
# DEFAULT_MODEL_PATH = os.getenv("DEFAULT_MODEL_PATH")
# hacemos que el DEFAULT_MODEL_PATH sean 2 carpetas arriba de la carpeta actual
DEFAULT_MODEL_PATH = os.getenv("DEFAULT_MODEL_PATH", "/app")
# KERAS
SEQUENCE_LENGTH = 300

# EXPORT
KERAS_MODEL = "clasificador_ver5.h5"
TOKENIZER_MODEL = "tokenizer.pkl"

SENTIMENT_THRESHOLD = [0.4, 0.7]
