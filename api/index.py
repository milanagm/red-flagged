from fastapi import FastAPI, HTTPException
from .models.schemas import ChatAnalysisRequest, AnalysisResponse
from .services.analyzers.hogwarts import HogwartsAnalyzer
from .services.analyzers.red_flag import RedFlagAnalyzer
from .services.analyzers.boomer import BoomerAnalyzer

ANALYZERS = {
    "hogwarts": HogwartsAnalyzer,
    "red_flag": RedFlagAnalyzer,
    "boomer": BoomerAnalyzer
}

app = FastAPI(
    title="Red Flag Me",
    description="API for analyzing chat messages with different personality tests",
    version="0.1.0",
)


@app.get("/api/py/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get("/api/py/analyzers")
async def list_analyzers():
    """List available analyzers"""
    return {
        "analyzers": [
            {
                "id": "hogwarts",
                "name": "Hogwarts House Sorting",
                "description": "Assess your Hogwarts house",
            },
            {
                "id": "red_flag",
                "name": "Red Flag Analysis",
                "description": "Analyze your red flags",
            },
            {
                "id": "boomer",
                "name": "Boomer Energy Check",
                "description": "Analyze your boomer vibes and energy level",
            },
        ]
    }


@app.post("/api/py/analyze", response_model=AnalysisResponse)
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
