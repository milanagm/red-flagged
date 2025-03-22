import axios from 'axios';

const API_URL = '/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

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

// API functions
export const getAnalyzers = async (): Promise<Analyzer[]> => {
  try {
    const response = await api.get('/analyzers');
    return response.data.analyzers;
  } catch (error) {
    console.error('Error fetching analyzers:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw error;
  }
};

export const analyzeChat = async (analyzerType: string, chatContent: string) => {
  try {
    const response = await api.post('/analyze', {
      analyzer_type: analyzerType,
      chat_content: chatContent,
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing chat:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw error;
  }
}; 