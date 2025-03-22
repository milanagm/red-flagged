import re
from datetime import datetime
from typing import List, Dict, Optional


class ChatMessage:
    def __init__(self, timestamp: datetime, sender: str, content: str):
        self.timestamp = timestamp
        self.sender = sender
        self.content = content


class ChatParser:
    def __init__(self):
        # Regex pattern for WhatsApp chat messages
        self.pattern = (
            r"^\[(\d{2}\.\d{2}\.\d{4},\s\d{2}:\d{2}:\d{2})\]\s([^:]+):\s(.+)$"
        )

    def parse_message(self, line: str) -> Optional[ChatMessage]:
        """Parse a single line of chat"""
        match = re.match(self.pattern, line)
        if not match:
            return None

        timestamp_str, sender, content = match.groups()
        try:
            timestamp = datetime.strptime(timestamp_str, "%d.%m.%Y, %H:%M:%S")
            return ChatMessage(timestamp, sender.strip(), content.strip())
        except ValueError:
            return None

    def parse_chat(self, chat_content: str) -> List[Dict]:
        """Parse the entire chat content"""
        messages = []
        for line in chat_content.split("\n"):
            line = line.strip()
            if not line:
                continue

            message = self.parse_message(line)
            if message:
                messages.append(
                    {
                        "timestamp": message.timestamp.isoformat(),
                        "sender": message.sender,
                        "content": message.content,
                    }
                )

        return messages
