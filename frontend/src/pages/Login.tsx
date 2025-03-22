import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just navigate to upload page
    navigate('/upload');
  };

  return (
    <div className="card">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Red Flag Me</h1>
        <p className="text-gray-600">Discover your personality </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Welcome :)</h2>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-field"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <button type="button" className="text-primary text-sm hover:underline">
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button className="text-primary hover:underline font-medium">
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login; 