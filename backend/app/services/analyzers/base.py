from abc import ABC, abstractmethod
from typing import List, Dict
from datetime import datetime


class BaseAnalyzer(ABC):
    def __init__(self):
        self.system_prompt = self._get_system_prompt()

    @abstractmethod
    def _get_system_prompt(self) -> str:
        """Return the system prompt for this analyzer"""
        pass

    @abstractmethod
    async def analyze(self, chat_content: str) -> Dict:
        """
        Analyze the chat messages and return results
        Args:
            chat_content: The chat content to analyze
        Returns:
            Dictionary containing analysis results
        """
        pass

    def _create_response(
        self,
        analysis_type: str,
        primary_result: str,
        confidence: float,
        detailed_analysis: str,
        key_indicators: List[str],
    ) -> Dict:
        """Create a standardized response format"""
        return {
            "analysis_type": analysis_type,
            "primary_result": primary_result,
            "confidence_score": confidence,
            "detailed_analysis": detailed_analysis,
            "key_indicators": key_indicators,
            "timestamp": datetime.utcnow().isoformat(),
        }
