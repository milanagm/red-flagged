

export async function getAnalyzers() {
  try {
    const response = await fetch(`/api/py/analyzers`)
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
    const response = await fetch(`/api/py/analyze`, {
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