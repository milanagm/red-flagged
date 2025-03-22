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
      {/* Main Content */}
      <main className="flex-1 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(https://i.pinimg.com/736x/95/c0/7d/95c07d8830438ad513b081f6d5ee848c.jpg)' }}>
        <div className="h-full bg-black bg-opacity-10 flex items-center justify-center p-4 pt-40">
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