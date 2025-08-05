'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    console.log('Starting sign in process...');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.error('Sign in error:', error);
        setMessage(error.message);
        setLoading(false);
      } else if (data.user) {
        console.log('Sign in successful, user:', data.user.id);
        setMessage('Sign in successful! Redirecting...');
        // Let AuthProvider handle the redirect automatically
        setLoading(false);
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setMessage('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      }
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the login link!');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden flex items-center justify-center p-6">
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-5 rounded-full -translate-y-24 translate-x-24"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500 opacity-5 rounded-full translate-y-16 -translate-x-16"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
            <div className="text-4xl text-white">⚡</div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h1>
          <p className="text-gray-600 text-lg font-medium">Continue your optimization journey</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
          
          {message && (
            <div className={`p-6 rounded-3xl mb-6 text-center font-semibold relative z-10 ${message.includes('Check your email') 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 shadow-sm' 
              : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${message.includes('Check your email') ? 'bg-green-500' : 'bg-red-500'}`}>
                  <span className="text-white text-sm">{message.includes('Check your email') ? '✓' : '!'}</span>
                </div>
                {message}
              </div>
            </div>
          )}

          <form className="space-y-8 relative z-10" onSubmit={handleSignIn}>
            <div className="space-y-6">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-bold rounded-3xl hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span>⚡</span>
                    Sign In
                  </div>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleMagicLink}
                disabled={loading}
                className="w-full py-4 px-8 bg-white border-2 border-blue-600 text-blue-600 text-lg font-bold rounded-3xl hover:bg-blue-50 hover:scale-105 transition-all duration-200 disabled:opacity-50 shadow-sm"
              >
                {loading ? '⏳ Sending...' : '📫 Send Magic Link'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center relative z-10">
            <p className="text-gray-600 font-medium">
              Don't have an account?{' '}
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 font-bold transition-colors duration-200">
                Start your journey
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}