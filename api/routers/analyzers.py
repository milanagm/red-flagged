from fastapi import APIRouter

router = APIRouter()

@router.get("/analyzers")
async def get_analyzers():
    """Get list of available analyzers"""
    analyzers = [
        {
            "id": "personality",
            "name": "Personality Analysis",
            "description": "Analyzes chat for personality traits"
        },
        {
            "id": "sentiment",
            "name": "Sentiment Analysis",
            "description": "Analyzes emotional tone of messages"
        }
    ]
    return {"analyzers": analyzers} 