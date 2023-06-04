from pydantic import BaseModel
from typing import List
from app.core.enums import Sentiment
from app.core.enums import Heartbeat, HeartbeatMulti


class SentimentPredictionResult(BaseModel):
    label: Sentiment
    score: float
    elapsed_time: float


class HeartbeatClassificationResult(BaseModel):
    label: Heartbeat
    score: float
    elapsed_time: float


class HeartbeatSegment(BaseModel):
    segment: List[float]
    label: HeartbeatMulti
    score: float


class HeartbeatClassificationResultMulti(BaseModel):
    heartbeats: List[HeartbeatSegment]
    total_elapsed_time: float
