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
    async def analyze(self, messages: List[Dict]) -> Dict:
        """
        Analyze the chat messages and return results
        Args:
            messages: List of message dictionaries with timestamp, sender, and content
        Returns:
            Dictionary containing analysis results
        """
        pass

    def _format_messages_for_openai(self, messages: List[Dict]) -> str:
        """Format messages into a single string for OpenAI"""
        formatted_messages = []
        for msg in messages:
            formatted_messages.append(
                f"[{msg['timestamp']}] {msg['sender']}: {msg['content']}"
            )
        return "\n".join(formatted_messages)

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
