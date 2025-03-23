from pydantic import BaseModel
from typing import List
from datetime import datetime


class ChatAnalysisRequest(BaseModel):
    chat_content: str
    analyzer_type: str


class AnalysisResult(BaseModel):
    analysis_type: str
    name_person_1: str
    name_person_2: str
    result_1: str
    result_2: str
    analysis_1: str
    analysis_2: str
    indicators_1: List[str]
    indicators_2: List[str]
    timestamp: datetime


class AnalysisResponse(BaseModel):
    status: str = "success"
    results: AnalysisResult


class ErrorResponse(BaseModel):
    status: str = "error"
    message: str
