import json
from typing import List, Dict
from .base import BaseAnalyzer
from ..openai_service import OpenAIService


class RedFlagAnalyzer(BaseAnalyzer):
    def __init__(self):
        super().__init__()
        self.openai_service = OpenAIService()

    def _get_system_prompt(self) -> str:
        return """You are an expert in analyzing communication patterns and behavioral red flags in conversations.
        Based on the chat messages provided, analyze the communication for potential red flags or concerning patterns.
        Consider factors like:
        - Respect for boundaries
        - Communication style
        - Emotional manipulation
        - Controlling behavior
        - Consistency and honesty
        - Response to disagreements
        
        Rate the overall red flag level from 0 to 5, where:
        0 = No red flags, healthy communication
        1 = Minor concerns, could be circumstantial
        2 = Some concerning patterns, worth noting
        3 = Significant red flags present
        4 = Multiple serious red flags
        5 = Extremely concerning patterns, immediate attention needed
        
        You must respond with a valid JSON object containing these exact fields:
        {
            "red_flag_level": int between 0 and 5,
            "confidence": float between 0 and 1,
            "analysis": "Detailed explanation of the red flags or lack thereof",
            "identified_flags": ["List of specific red flags or concerning patterns observed"]
        }
        """

    async def analyze(self, messages: List[Dict]) -> Dict:
        chat_content = self._format_messages_for_openai(messages)

        # Get OpenAI's analysis
        response = self.openai_service.analyze_chat(self.system_prompt, chat_content)

        try:
            result = json.loads(response)
            return self._create_response(
                analysis_type="red_flag",
                primary_result=str(result["red_flag_level"]),
                confidence=result["confidence"],
                detailed_analysis=result["analysis"],
                key_indicators=result["identified_flags"],
            )
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse OpenAI response: {str(e)}")
