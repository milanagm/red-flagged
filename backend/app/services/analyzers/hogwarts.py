import json
from typing import Dict
from .base import BaseAnalyzer
from ..openai_service import OpenAIService


class HogwartsAnalyzer(BaseAnalyzer):
    def __init__(self):
        super().__init__()
        self.openai_service = OpenAIService()

    def _get_system_prompt(self) -> str:
        return """You are an expert in analyzing communication patterns and personality traits to determine which Hogwarts house someone belongs to.
        Based on the chat messages provided, analyze the person's communication style, personality traits, and behavior to determine their most suitable Hogwarts house.
        
        Consider these house traits:
        - Gryffindor: Courage, bravery, determination, chivalry
        - Slytherin: Ambition, resourcefulness, cunning, leadership
        - Ravenclaw: Intelligence, wit, wisdom, creativity
        - Hufflepuff: Hard work, dedication, patience, loyalty
        
        You must respond with a valid JSON object containing these exact fields:
        {
            "house": "House name",
            "confidence": float between 0 and 1,
            "analysis": "Detailed explanation of why this house fits",
            "key_traits": ["List of observed traits that led to this conclusion"]
        }
        """

    async def analyze(self, chat_content: str) -> Dict:
        # Get OpenAI's analysis
        response = self.openai_service.analyze_chat(self.system_prompt, chat_content)

        try:
            result = json.loads(response)
            return self._create_response(
                analysis_type="hogwarts",
                primary_result=result["house"],
                primary_result_type="house",
                confidence=result["confidence"],
                detailed_analysis=result["analysis"],
                key_indicators=result["key_traits"],
            )
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse OpenAI response: {str(e)}")
