from enum import Enum


class Sentiment(Enum):
    NEGATIVE = "NEGATIVE"
    NEUTRAL = "NEUTRAL"
    POSITIVE = "POSITIVE"


class Heartbeat(Enum):
    NORMAL = "NORMAL"
    ABNORMAL = "ABNORMAL"
    SUSPICIOUS = "SUSPICIOUS"
    UNKNOWN = "UNKNOWN"


class HeartbeatMulti(Enum):
    N = "N"
    S = "S"
    V = "V"
    F = "F"
    Q = "Q"
