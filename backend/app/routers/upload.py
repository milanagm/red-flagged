from fastapi import APIRouter, UploadFile, HTTPException
from ..services.chat_parser import ChatParser

router = APIRouter()
chat_parser = ChatParser()


@router.post("/upload")
async def upload_chat(file: UploadFile):
    """
    Upload and parse a WhatsApp chat file
    """
    if not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Only .txt files are allowed")

    try:
        content = await file.read()
        chat_content = content.decode("utf-8")

        # Parse the chat content
        messages = chat_parser.parse_chat(chat_content)

        if not messages:
            raise HTTPException(
                status_code=400, detail="No valid messages found in the chat file"
            )

        return {
            "status": "success",
            "message_count": len(messages),
            "messages": messages,
        }

    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="File encoding not supported. Please ensure the file is UTF-8 encoded.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the file: {str(e)}",
        )
