from pydantic import BaseModel
from typing import List

class TextPayload(BaseModel):
    text: str


def payload_to_text(payload: TextPayload) -> str:
    return payload.text


class HeartbeatPayload(BaseModel):
    sequence: List[float]


class HeartbeatPayloadImage(BaseModel):
    sequence: str