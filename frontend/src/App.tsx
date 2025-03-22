import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Upload from './pages/Upload';

const App: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center z-50">
        <h1 className="text-xl font-bold">PersonaChat</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">mmilanagm</span>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 3a1 1 0 10-2 0v3.586L9.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 9.586V6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(https://i.pinimg.com/736x/95/c0/7d/95c07d8830438ad513b081f6d5ee848c.jpg)' }}>
        <div className="h-full bg-black bg-opacity-10 flex items-center justify-center p-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App; 