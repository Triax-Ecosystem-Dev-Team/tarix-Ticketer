import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Lock, Mail, Bus, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = await login({ email, password }, rememberMe);
      
      // Redirect based on the EXACT roles defined by the backend
      if (user.role === 'Admin') {
        navigate('/admin');
      } else if (user.role === 'Ticketer') {
        navigate('/');
      } else if (user.role === 'Passenger') {
        // Route passengers directly into the booking flow
        navigate('/booking/identify'); 
      } else {
        setError('Unauthorized access boundary.');
      }
    } catch (err: any) {
      // SECURITY FIX: Generic error message prevents User Enumeration
      setError('Invalid email address or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-inter">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-blue rounded-2xl mb-6 shadow-lg shadow-primary-blue/20">
            <Bus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-text-dark tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-text-gray">Please enter your credentials to login</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm border border-red-100 flex items-center animate-shake">
            <div className="w-1 h-4 bg-red-500 rounded-full mr-3" />
            {error}
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-blue text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all placeholder:text-gray-400"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-blue text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all placeholder:text-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-text-dark transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue transition-colors cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-text-gray cursor-pointer">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-blue hover:text-blue-700 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={clsx(
              "group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white transition-all shadow-lg",
              isLoading 
                ? "bg-blue-400 cursor-not-allowed shadow-none" 
                : "bg-primary-blue hover:bg-blue-700 hover:shadow-primary-blue/20 active:scale-[0.98]"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-text-gray">
          <span>Don't have an account? </span>
          <a href="#" className="font-semibold text-primary-blue hover:text-blue-700 transition-colors">
            Contact your administrator
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
