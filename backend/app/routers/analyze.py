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
    print(f"Analyzing chat with analyzer type: {request.analyzer_type}")
    if request.analyzer_type not in ANALYZERS:
        raise HTTPException(
            status_code=400, detail=f"Unknown analyzer type: {request.analyzer_type}"
        )

    try:
        # Create analyzer instance
        analyzer_class = ANALYZERS[request.analyzer_type]
        analyzer = analyzer_class()

        # Perform analysis
        results = await analyzer.analyze(request.chat_content)

        return {"status": "success", "results": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
