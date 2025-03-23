import json
from typing import Dict
from .base import BaseAnalyzer
from ..openai_service import OpenAIService


class BoomerAnalyzer(BaseAnalyzer):
    def __init__(self):
        super().__init__()
        self.openai_service = OpenAIService()

    def _get_system_prompt(self) -> str:
        return """You are an expert in analyzing communication patterns and generational traits to determine if someone gives off "boomer vibes".
        Based on the chat messages provided, analyze the person's communication style, references, and behavior to determine their boomer energy level.
        
        Consider these boomer indicators:
        - Using outdated slang or references
        - Resistance to new technology
        - Complaining about "kids these days"
        - Excessive use of ellipsis (...)
        - ALL CAPS typing
        - Sharing chain messages/forwards
        - References to "the good old days"
        - Difficulty with modern internet culture
        - Formal or overly proper texting style
        - Confusion about emojis or using them incorrectly
        
        Rate the boomer energy level from 0 to 5, where:
        0 = Zero boomer energy, totally hip and current
        1 = Slight boomer tendencies, but mostly with the times
        2 = Moderate boomer vibes, occasional dated references
        3 = Strong boomer energy, frequent outdated patterns
        4 = Very strong boomer presence, consistently dated communication
        5 = Maximum boomer level, could be writing from 1975
        
        You must respond with a valid JSON object containing these exact fields:
        {
            "boomer_level": int between 0 and 5,
            "confidence": float between 0 and 1,
            "analysis": "Detailed explanation of the boomer vibes or lack thereof",
            "boomer_traits": ["List of specific boomer indicators observed"]
        }
        """

    async def analyze(self, chat_content: str) -> Dict:
        # Get OpenAI's analysis
        response = self.openai_service.analyze_chat(self.system_prompt, chat_content)

        try:
            result = json.loads(response)
            return self._create_response(
                analysis_type="boomer",
                primary_result=str(result["boomer_level"]),
                primary_result_type="boomer_level",
                confidence=result["confidence"],
                detailed_analysis=result["analysis"],
                key_indicators=result["boomer_traits"],
            )
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse OpenAI response: {str(e)}") 