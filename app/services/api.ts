let API_BASE_URL = "https://red-flagged-three.vercel.app"
if (process.env.NODE_ENV === "development") {
  API_BASE_URL = "http://localhost:8000"
}

export async function getAnalyzers() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyzers`)
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to fetch analyzers: ${error}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export async function analyzeChat(analyzerType: string, chatContent: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        analyzer_type: analyzerType,
        chat_content: chatContent,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to analyze chat: ${error}`)
    }

    return response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
} 