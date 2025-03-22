import React, { useState, useEffect } from 'react';
import { getAnalyzers, analyzeChat } from '../api_connection/api';

interface AnalysisResult {
  status: string;
  results: {
    analysis_type: string;
    primary_result: string;
    primary_result_type: string;
    confidence_score: number;
    detailed_analysis: string;
    key_indicators: string[];
    timestamp: string;
  };
}

interface Analyzer {
  id: string;
  name: string;
  description: string;
}

const ResultCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-4">
    <h4 className="text-lg font-semibold mb-3 text-gray-800">{title}</h4>
    {children}
  </div>
);

const ConfidenceBar: React.FC<{ score: number }> = ({ score }) => {
  const getColor = (score: number) => {
    if (score >= 0.8) return 'bg-red-500';
    if (score >= 0.6) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
      <div
        className={`h-2.5 rounded-full ${getColor(score)}`}
        style={{ width: `${score * 100}%` }}
      ></div>
    </div>
  );
};

const PrimaryResult: React.FC<{ result: string; type: string }> = ({ result, type }) => {
  const getResultDisplay = () => {
    if (type === 'red_flag') {
      const level = parseInt(result);
      const getColor = () => {
        if (level >= 4) return 'text-red-600 bg-red-50';
        if (level >= 3) return 'text-orange-600 bg-orange-50';
        if (level >= 2) return 'text-yellow-700 bg-yellow-50';
        return 'text-green-600 bg-green-50';
      };
      return {
        title: 'Red Flag Level',
        value: `${level}/5`,
        className: getColor()
      };
    }
    if (type === 'hogwarts') {
      const getHouseColors = () => {
        switch (result.toLowerCase()) {
          case 'gryffindor': return 'text-red-700 bg-red-50';
          case 'slytherin': return 'text-green-700 bg-green-50';
          case 'ravenclaw': return 'text-blue-700 bg-blue-50';
          case 'hufflepuff': return 'text-yellow-700 bg-yellow-50';
          default: return 'text-gray-700 bg-gray-50';
        }
      };
      return {
        title: 'Hogwarts House',
        value: result,
        className: getHouseColors()
      };
    }
    return {
      title: type,
      value: result,
      className: 'text-gray-700 bg-gray-50'
    };
  };

  const display = getResultDisplay();

  return (
    <div className="text-center mb-8">
      <div className="inline-block bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">{display.title}</h3>
        <div className={`text-5xl font-bold px-8 py-4 rounded-lg ${display.className}`}>
          {display.value}
        </div>
      </div>
    </div>
  );
};

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [analyzerType, setAnalyzerType] = useState<'hogwarts' | 'red_flag'>('hogwarts');
  const [analyzers, setAnalyzers] = useState<Analyzer[]>([]);

  useEffect(() => {
    const fetchAnalyzers = async () => {
      try {
        const analyzers = await getAnalyzers();
        setAnalyzers(analyzers);
      } catch (error) {
        console.error('Error fetching analyzers:', error);
      }
    };

    fetchAnalyzers();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleAnalyzerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAnalyzerType(event.target.value as 'hogwarts' | 'red_flag');
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsAnalyzing(true);
      
      // Read file content as text
      const fileContent = await file.text();

      // Get analysis results
      const result = await analyzeChat(analyzerType, fileContent);

      setAnalysisResults(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="card">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Get Flagged!</h1>
      </div>

      <div className="mb-6">
        <label htmlFor="analyzer-type" className="block text-sm font-medium text-gray-700 mb-2">
          Assessment Flag 
        </label>
        <select
          id="analyzer-type"
          value={analyzerType}
          onChange={handleAnalyzerChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {analyzers.map((analyzer) => (
            <option key={analyzer.id} value={analyzer.id} title={analyzer.description}>
              {analyzer.name}
            </option>
          ))}
        </select>
        {analyzers.find(a => a.id === analyzerType)?.description && (
          <p className="mt-2 text-sm text-gray-500">
            {analyzers.find(a => a.id === analyzerType)?.description}
          </p>
        )}
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${file ? 'bg-purple-500 text-white flex items-center justify-center' : 'border-gray-300'}`}
        onClick={file ? handleUpload : undefined}
      >
        {!file && (
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        )}
        <h3 className="text-lg font-medium mb-2">{file ? 'Start' : 'Upload Chat'}</h3>
        <p className="text-gray-500 mb-4">{file ? '' : 'drag and drop or select below'}</p>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        {!file && (
          <label htmlFor="file-upload" className="btn-primary inline-block cursor-pointer">
            Select File
          </label>
        )}
      </div>

      {analysisResults && (
        <div className="mt-8 space-y-6">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Analysis Results</h3>
          
          <PrimaryResult 
            result={analysisResults.results.primary_result}
            type={analysisResults.results.analysis_type}
          />

          <ResultCard title="Overall Assessment">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Confidence Score</span>
                <span className="font-semibold">{(analysisResults.results.confidence_score * 100).toFixed(0)}%</span>
              </div>
              <ConfidenceBar score={analysisResults.results.confidence_score} />
            </div>
            <p className="text-gray-700 leading-relaxed">
              {analysisResults.results.detailed_analysis}
            </p>
          </ResultCard>

          <ResultCard title="Key Indicators">
            <ul className="space-y-3">
              {analysisResults.results.key_indicators.map((indicator, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 mr-3 flex-shrink-0 text-sm">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{indicator}</span>
                </li>
              ))}
            </ul>
          </ResultCard>

          <ResultCard title="Analysis Details">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Analysis Type</p>
                <p className="font-medium">{analysisResults.results.analysis_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Timestamp</p>
                <p className="font-medium">
                  {new Date(analysisResults.results.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </ResultCard>
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