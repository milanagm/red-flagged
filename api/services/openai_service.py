from openai import OpenAI
from typing import Dict, Any
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class OpenAIService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError(
                "OPENAI_API_KEY environment variable is not set. Please check your .env file."
            )
        self.client = OpenAI(api_key=api_key)

    def analyze_chat(
        self, system_prompt: str, chat_content: str, model: str = "gpt-4o-mini"
    ) -> Dict[str, Any]:
        """
        Analyze chat content using OpenAI's API
        Args:
            system_prompt: The system prompt for the specific analysis
            chat_content: The formatted chat content to analyze
            model: The OpenAI model to use
        Returns:
            The model's response as a parsed JSON dictionary
        """
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": chat_content},
                ],
                temperature=0.7,
                max_tokens=1000,
                response_format={"type": "json_object"},
            )
            return response.choices[0].message.content

        except Exception as e:
            raise Exception(f"Error calling OpenAI API: {str(e)}")
