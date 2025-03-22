import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

interface Analyzer {
  id: string;
  name: string;
  description: string;
}

interface AnalyzersResponse {
  analyzers: Analyzer[];
}

export interface AnalysisResponse {
  status: string;
  results: any; // Type this based on your backend response structure
}

export const api = {

  getAnalyzers: async (): Promise<AnalyzersResponse> => {
    const response = await axios.get(`${API_BASE_URL}/analyzers`);
    return response.data;
  },

  analyzeChat: async (analyzerType: string, chatContent: string[]): Promise<AnalysisResponse> => {
    const response = await axios.post(`${API_BASE_URL}/analyze`, {
      analyzer_type: analyzerType,
      chat_content: chatContent,
    });
    console.log(response.data);
    return response.data;
  },
}; 