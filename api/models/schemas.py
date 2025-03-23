from pydantic import BaseModel
from typing import List
from datetime import datetime


class ChatAnalysisRequest(BaseModel):
    chat_content: str
    analyzer_type: str


class AnalysisResult(BaseModel):
    analysis_type: str
    primary_result: str
    confidence_score: float
    detailed_analysis: str
    key_indicators: List[str]
    timestamp: datetime


class AnalysisResponse(BaseModel):
    status: str = "success"
    results: AnalysisResult


class ErrorResponse(BaseModel):
    status: str = "error"
    message: str
