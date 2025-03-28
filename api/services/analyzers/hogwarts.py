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
        Based on the chat messages provided, analyze both people's communication styles, personality traits, and behavior to determine their most suitable Hogwarts houses.
        
        Consider these house traits:
        - Gryffindor: Courage, bravery, determination, chivalry
        - Slytherin: Ambition, resourcefulness, cunning, leadership
        - Ravenclaw: Intelligence, wit, wisdom, creativity
        - Hufflepuff: Hard work, dedication, patience, loyalty
        
        You must respond with a valid JSON object containing these exact fields:
        {
            "name_person_1": "Name of first person",
            "name_person_2": "Name of second person",
            "house_1": "House name for person 1",
            "house_2": "House name for person 2",
            "analysis_1": "Detailed explanation of why this house fits person 1",
            "analysis_2": "Detailed explanation of why this house fits person 2",
            "key_traits_1": ["List of observed traits for person 1"],
            "key_traits_2": ["List of observed traits for person 2"]
        }
        """

    async def analyze(self, chat_content: str) -> Dict:
        # Get OpenAI's analysis
        response = self.openai_service.analyze_chat(self.system_prompt, chat_content)

        try:
            result = json.loads(response)
            return self._create_dual_response(
                analysis_type="hogwarts",
                name_person_1=result["name_person_1"],
                name_person_2=result["name_person_2"],
                result_1=result["house_1"],
                result_2=result["house_2"],
                analysis_1=result["analysis_1"],
                analysis_2=result["analysis_2"],
                indicators_1=result["key_traits_1"],
                indicators_2=result["key_traits_2"],
            )
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse OpenAI response: {str(e)}")
