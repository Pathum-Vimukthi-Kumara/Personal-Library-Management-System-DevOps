import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, setAuthToken } from '../../services/api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const data = await login(username, password);

      if (data.token) {
        // Store token and user info
        setAuthToken(data.token);
        localStorage.setItem('username', username);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (error) {
      setError(error.message || 'Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      <div className="max-w-md w-full bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-indigo-100 p-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-sm">📚</span>
          <h2 className="text-3xl font-bold text-gray-900">Library</h2>
        </div>
        <p className="text-center text-gray-600 mb-6">Welcome back - manage your personal collection</p>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded text-sm" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username"
              type="text"
              placeholder="e.g. johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-600 hover:text-indigo-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                Remember me
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700">Forgot password?</a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          New to Library? <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">Create an account</Link>
        </div>

        {/* Demo credentials removed for production */}
      </div>
    </div>
  );
}

export default Login;
