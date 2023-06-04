import os
import time
import tempfile
from typing import List, Tuple

import numpy as np
import pickle
import tensorflow as tf
from loguru import logger
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pandas as pd


from app.core.messages import NO_VALID_PAYLOAD
from app.models.payload import HeartbeatPayload, TextPayload, payload_to_text
from app.models.prediction import HeartbeatClassificationResultMulti, HeartbeatClassificationResult, SentimentPredictionResult, HeartbeatSegment
from app.core.enums import Sentiment, Heartbeat, HeartbeatMulti
from app.core.config import (
    KERAS_MODEL,
    TOKENIZER_MODEL,
    SEQUENCE_LENGTH,
    SENTIMENT_THRESHOLD,
)
from app.core.helper import proceso_segmentacion


class HeartbeatClassificationModel:
    def __init__(
        self, model_dir,
    ):
        self.model_dir = model_dir
        self._load_local_model()

    """
    En esta parte ya no vamos a usar el tokenizer
    """
    def _load_local_model(self):
        keras_model_path = os.path.join(self.model_dir, KERAS_MODEL)
        with tempfile.NamedTemporaryFile(suffix=".h5") as local_file:
            with tf.io.gfile.GFile(keras_model_path, mode="rb") as gcs_file:
                local_file.write(gcs_file.read())
                self.model = tf.keras.models.load_model(local_file.name, compile=False)
        """
        Omitimos el tokenizer porque estamos usando ECG y esos ya andan listos para predecirse
        """
        #tokenizer_path = os.path.join(self.model_dir, TOKENIZER_MODEL)
        #self.tokenizer = pickle.load(tf.io.gfile.GFile(tokenizer_path, mode="rb"))

    """
    def _decode_prediction(self, prediction: np.ndarray) -> str:
        # Usa np.argmax() en lugar de la condición de verdad
        predicted_class = prediction[0] ## Para la clase normal
        if predicted_class > 0.7:
            return Heartbeat.NORMAL
        else:
            return Heartbeat.ABNORMAL
    """


    def _decode_prediction(self, prediction: np.ndarray) -> str:
        # Usa np.argmax() en lugar de la condición de verdad
        predicted_class = prediction[0]  ## Para la clase normal
        if predicted_class > 0.7:
            return Heartbeat.NORMAL
        else:
            return Heartbeat.ABNORMAL

    def _decode_prediction_multi(self, prediction: np.ndarray) -> str:
        predicted_class_index = np.argmax(prediction)
        return HeartbeatMulti(predicted_class_index).name

    #def decode_all_predictions(self, predictions: np.ndarray) -> List[str]:
    #    return [self._decode_prediction_multi(prediction) for prediction in predictions]

    def decode_all_predictions(self, predictions: np.ndarray) -> List[Tuple[HeartbeatMulti, float]]:
        # Orden de las clases en el modelo
        class_order = [HeartbeatMulti.N, HeartbeatMulti.S, HeartbeatMulti.V, HeartbeatMulti.F, HeartbeatMulti.Q]
        decoded_predictions = []
        for prediction in predictions:
            predicted_class_index = np.argmax(prediction)
            label = class_order[predicted_class_index]
            score = prediction[predicted_class_index]
            decoded_predictions.append((label, score))
        return decoded_predictions

    def _predict(self, heartbeat_sequence: pd.DataFrame) -> float:
        logger.debug("Predicting.")
        # input_data = [heartbeat_sequence]
        # input_data = [heartbeat_sequence] # Porque ya es una lista de listas
        return self.model.predict(heartbeat_sequence)
    """
    def _post_process(
        self, heartbeat_sequence: list, prediction: np.ndarray, start_time: float
    ) -> HeartbeatClassificationResult:
        logger.debug("Post-processing prediction.")
        label = self.decode_all_predictions(prediction)
        score_prediction = prediction[0] if label == Heartbeat.NORMAL else prediction[1]
        if label == Heartbeat.NORMAL:
            logger.info("Normal heartbeat detected.")
        else:
            logger.info("Abnormal heartbeat detected.")

        return HeartbeatClassificationResult(
            label=label, score=score_prediction, elapsed_time=(time.time() - start_time),
        )
    """
    """
    def _post_process(
            self, heartbeat_sequence: List[List[float]], predictions: np.ndarray, start_time: float
    ) -> HeartbeatClassificationResultMulti:
        logger.debug("Post-processing prediction.")
        labels = self.decode_all_predictions(predictions)

        heartbeats = []
        for i, (segment, prediction, label) in enumerate(zip(heartbeat_sequence, predictions, labels)):
            score_prediction = prediction[0] if label == HeartbeatMulti.N else prediction[1]
            heartbeats.append(HeartbeatSegment(segment=segment, label=label, score=score_prediction))
            if label == Heartbeat.NORMAL:
                logger.info(f"Normal heartbeat detected in segment {i}.")
            else:
                logger.info(f"Abnormal heartbeat detected in segment {i}.")

        return HeartbeatClassificationResult(
            heartbeats=heartbeats, total_elapsed_time=(time.time() - start_time),
        )
    """

    def _post_process(
            self, heartbeat_sequence: np.ndarray, predictions: np.ndarray, start_time: float
    ) -> HeartbeatClassificationResultMulti:
        logger.debug("Post-processing prediction.")
        decoded_predictions = self.decode_all_predictions(predictions)

        heartbeats = []
        for i, (segment, (label, score)) in enumerate(zip(heartbeat_sequence, decoded_predictions)):
            segment = segment.tolist()
            print(f"segment: {segment}, type: {type(segment)}")
            heartbeats.append(HeartbeatSegment(segment=segment, label=label, score=score))
            if label == HeartbeatMulti.N:
                logger.info(f"Normal heartbeat detected in segment {i}.")
            else:
                logger.info(f"Abnormal heartbeat detected in segment {i}.")

        return HeartbeatClassificationResultMulti(
            heartbeats=heartbeats, total_elapsed_time=(time.time() - start_time),
        )

    def predict(self, payload: HeartbeatPayload):
        if payload is None:
            raise ValueError(NO_VALID_PAYLOAD.format(payload))

        start_at = time.time()
        heartbeat_sequence = payload.sequence
        # Latidos es un dataframe, segmentos es un array
        latidos, segmentos = proceso_segmentacion(heartbeat_sequence, 360) ## Añadimos la función para obtener latidos
        #print('latidos: ', latidos)
        # cast segmentos a ndarray
        segmentos = np.array(segmentos)
        #print('segmentos: ', segmentos)
        #print('type segmentos: ', type(segmentos))
        # prediction = self._predict(heartbeat_sequence)
        prediction = self._predict(latidos) # Obtenemos la predicción enviando los latidos
        # cast prediction to ndarray
        prediction = np.array(prediction)
        # Obtén la clase predicha y la probabilidad de la clase predicha
        #print('prediction type: ', type(prediction))
        #print('prediction: ', prediction)
        predicted_class = np.argmax(prediction)
        predicted_prob = np.max(prediction)
        post_processed_result = self._post_process(
            segmentos, prediction, start_at
        )

        return post_processed_result



