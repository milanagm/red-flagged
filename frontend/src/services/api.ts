import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_URL = `${BASE_URL}/api`;

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
  const response = await api.get('/analyzers');
  return response.data.analyzers;
};

export const analyzeChat = async (analyzerType: string, chatContent: string) => {
  const response = await api.post('/analyze', {
    analyzer_type: analyzerType,
    chat_content: chatContent,
  });
  return response.data;
}; 