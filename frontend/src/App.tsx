import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Upload from './pages/Upload';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: 'url(https://i.pinimg.com/736x/95/c0/7d/95c07d8830438ad513b081f6d5ee848c.jpg)' }}>
      <div className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center p-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </div>
    </div>
  );
};

export default App; 