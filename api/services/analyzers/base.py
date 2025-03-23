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

    def _create_dual_response(
        self,
        analysis_type: str,
        name_person_1: str,
        name_person_2: str,
        result_1: str,
        result_2: str,
        analysis_1: str,
        analysis_2: str,
        indicators_1: List[str],
        indicators_2: List[str],
    ) -> Dict:
        """Create a standardized response format for dual-person analysis"""
        return {
            "analysis_type": analysis_type,
            "name_person_1": name_person_1,
            "name_person_2": name_person_2,
            "result_1": result_1,
            "result_2": result_2,
            "analysis_1": analysis_1,
            "analysis_2": analysis_2,
            "indicators_1": indicators_1,
            "indicators_2": indicators_2,
            "timestamp": datetime.utcnow().isoformat(),
        }
