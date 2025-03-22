import React from 'react';

const TopNav: React.FC = () => {
  return (
    <nav className="top-nav bg-white/10">
      <h1 className="text-xl font-bold">Red Flag Me</h1>
      <div className="flex items-center gap-4">
        <button 
          className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
          title="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default TopNav; 