from fastapi import APIRouter, HTTPException
from ..models.schemas import ChatAnalysisRequest, AnalysisResponse
from ..services.analyzers.hogwarts import HogwartsAnalyzer
from ..services.analyzers.red_flag import RedFlagAnalyzer

router = APIRouter()

# Registry of available analyzers
ANALYZERS = {"hogwarts": HogwartsAnalyzer, "red_flag": RedFlagAnalyzer}


@router.get("/analyzers")
async def list_analyzers():
    """List available analyzers"""
    return {
        "analyzers": [
            {
                "id": "hogwarts",
                "name": "Hogwarts House Sorting",
                "description": "Determines which Hogwarts house best matches the chat participant's personality",
            },
            {
                "id": "red_flag",
                "name": "Red Flag Analysis",
                "description": "Analyzes the chat for potential red flags and concerning patterns",
            },
        ]
    }


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_chat(request: ChatAnalysisRequest):
    """
    Analyze chat messages using the specified analyzer
    """
    if request.analyzer_type not in ANALYZERS:
        raise HTTPException(
            status_code=400, detail=f"Unknown analyzer type: {request.analyzer_type}"
        )

    try:
        # Create analyzer instance
        analyzer_class = ANALYZERS[request.analyzer_type]
        analyzer = analyzer_class()

        # Parse messages from the chat content
        from ..services.chat_parser import ChatParser

        parser = ChatParser()
        messages = parser.parse_chat(request.chat_content)

        if not messages:
            raise HTTPException(
                status_code=400, detail="No valid messages found in the chat content"
            )

        # Perform analysis
        results = await analyzer.analyze(messages)

        return {"status": "success", "results": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
