"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }
    let userRole = null;
    if (data.user && data.user.user_metadata && data.user.user_metadata.role) {
      userRole = data.user.user_metadata.role;
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      userRole = profile?.role || null;
    }
    localStorage.setItem('user', JSON.stringify({ email: data.user.email, role: userRole, id: data.user.id }));
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div className="flex items-center mb-6">
          <img src="/Logo.svg" alt="SumSip Logo" className="h-10 w-10 mr-2" />
          <span className="text-3xl font-extrabold text-indigo-700 tracking-tight">SumSip</span>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Sign in to your account</h2>
        <p className="text-gray-500 mb-6 text-center text-sm">Welcome back! Please enter your email and password to continue.</p>
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center -mt-2">{error}</div>}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow transition flex items-center justify-center disabled:opacity-60"
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            )}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 text-gray-400 text-xs text-center">&copy; {new Date().getFullYear()} SumSip. All rights reserved.</div>
      </div>
    </div>
  );
} 