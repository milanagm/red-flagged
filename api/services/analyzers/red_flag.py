import json
from typing import Dict
from .base import BaseAnalyzer
from ..openai_service import OpenAIService


class RedFlagAnalyzer(BaseAnalyzer):
    def __init__(self):
        super().__init__()
        self.openai_service = OpenAIService()

    def _get_system_prompt(self) -> str:
        return """You are an expert in analyzing communication patterns and behavioral red flags in conversations.
        Based on the chat messages provided, analyze both people's communication for potential red flags or concerning patterns.
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
            "name_person_1": "Name of first person",
            "name_person_2": "Name of second person",
            "red_flag_level_1": int between 0 and 5,
            "red_flag_level_2": int between 0 and 5,
            "analysis_1": "Detailed explanation of the red flags or lack thereof for person 1",
            "analysis_2": "Detailed explanation of the red flags or lack thereof for person 2",
            "identified_flags_1": ["List of specific red flags or concerning patterns observed for person 1"],
            "identified_flags_2": ["List of specific red flags or concerning patterns observed for person 2"]
        }
        """

    async def analyze(self, chat_content: str) -> Dict:
        # Get OpenAI's analysis
        response = self.openai_service.analyze_chat(self.system_prompt, chat_content)

        try:
            result = json.loads(response)
            return self._create_dual_response(
                analysis_type="red_flag",
                name_person_1=result["name_person_1"],
                name_person_2=result["name_person_2"],
                result_1=str(result["red_flag_level_1"]),
                result_2=str(result["red_flag_level_2"]),
                analysis_1=result["analysis_1"],
                analysis_2=result["analysis_2"],
                indicators_1=result["identified_flags_1"],
                indicators_2=result["identified_flags_2"],
            )
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse OpenAI response: {str(e)}")
