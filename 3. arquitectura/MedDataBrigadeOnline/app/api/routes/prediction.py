from fastapi import APIRouter, Depends
from starlette.requests import Request

#from app.models.payload import TextPayload
#from app.models.prediction import SentimentPredictionResult
#from app.services.models import SentimentAnalysisModel

# Importa las clases de modelos necesarias
from app.models.payload import HeartbeatPayload, HeartbeatPayloadImage
from app.models.prediction import HeartbeatClassificationResultMulti
from app.services.models import HeartbeatClassificationModel
from app.services.models_image import HeartbeatClassificationModelImage

router = APIRouter()

"""
@router.post("/predict", response_model=SentimentPredictionResult, name="predict")
def post_predict(
    request: Request, data: TextPayload = None,
) -> SentimentPredictionResult:

    model: SentimentAnalysisModel = request.app.state.model
    prediction: SentimentPredictionResult = model.predict(data)

    return prediction
"""


@router.post("/classify_heartbeat", response_model=HeartbeatClassificationResultMulti, name="classify_heartbeat")
def post_classify_heartbeat(
    request: Request, data: HeartbeatPayload = None,
) -> HeartbeatClassificationResultMulti:

    model: HeartbeatClassificationModel = request.app.state.model
    prediction: HeartbeatClassificationResultMulti = model.predict(data)

    return prediction


@router.post("/classify_heartbeat_image", response_model=HeartbeatClassificationResultMulti, name="classify_heartbeat_image")
def post_classify_heartbeat(
    request: Request, data: HeartbeatPayloadImage = None,
) -> HeartbeatClassificationResultMulti:

    model_image: HeartbeatClassificationModelImage = request.app.state.model_image
    prediction: HeartbeatClassificationResultMulti = model_image.predict(data)

    return prediction
