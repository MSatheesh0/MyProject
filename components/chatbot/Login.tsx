import React, { useState } from 'react';
import { CloseIcon } from './icons';
import { supabase } from '../../services/supabaseClient';

interface LoginProps {
  onLoginSuccess: () => void;
  onClose: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error) {
        throw error;
      }
      onLoginSuccess();
    } catch (err: any) {
      setError(err.error_description || err.message || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close login form"
        >
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold text-center text-blue-400 mb-2">Admin Login</h2>
        <p className="text-center text-gray-400 mb-6">Access your portfolio dashboard.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="username"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="username/email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Password"
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:opacity-75 text-white font-bold py-3 px-4 rounded-md transition-all duration-200 shadow-lg hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

