import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export interface UploadResponse {
  status: string;
  message_count: number;
  messages: string[];
}

export interface AnalysisResponse {
  status: string;
  results: any; // Type this based on your backend response structure
}

export const api = {
  uploadChat: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  analyzeChat: async (analyzerType: string, chatContent: string[]): Promise<AnalysisResponse> => {
    const response = await axios.post(`${API_BASE_URL}/analyze`, {
      analyzer_type: analyzerType,
      chat_content: chatContent,
    });

    return response.data;
  },
}; 