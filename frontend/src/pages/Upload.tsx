import React, { useState } from 'react';
import axios from 'axios';

interface AnalysisResult {
  status: string;
  results: any; // Type this based on your backend response
}

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsAnalyzing(true);
      const formData = new FormData();
      formData.append('file', file);

      // Upload the file
      const uploadResponse = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Get analysis results
      const analysisResponse = await axios.post('http://localhost:8000/api/analyze', {
        analyzer_type: 'red_flag',
        chat_content: uploadResponse.data.messages,
      });

      setAnalysisResults(analysisResponse.data);
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="card">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Get Red Flagged!</h1>
        <p className="text-gray-600">Let the magic happen here!</p>
      </div>

      <div className="flex space-x-4 mb-8">
        <button className="btn-primary">Upload</button>
        <button className="btn-primary bg-opacity-10 text-primary hover:bg-opacity-20">
          Analysis
        </button>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">Upload WhatsApp Chat</h3>
        <p className="text-gray-500 mb-4">Drag and drop your WhatsApp chat .txt file here</p>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="btn-primary inline-block cursor-pointer">
          Select File
        </label>
      </div>

      {file && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Selected file: {file.name}</p>
          <button
            onClick={handleUpload}
            disabled={isAnalyzing}
            className="btn-primary mt-2"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Chat'}
          </button>
        </div>
      )}

      {analysisResults && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {JSON.stringify(analysisResults, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">How to export your WhatsApp chat</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>Open the WhatsApp chat you want to analyze</li>
          <li>Tap the three dots (⋮) in the top right corner</li>
          <li>Select "More" → "Export chat"</li>
          <li>Choose "Without media" for best results</li>
        </ol>
      </div>
    </div>
  );
};

export default Upload; 