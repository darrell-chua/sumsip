"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function RolesPage() {
  const router = useRouter();
  const [accountants, setAccountants] = useState([]);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.role !== 'owner') {
        router.replace('/dashboard');
        return;
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, [router]);

  // Fetch accountants from profiles table
  const fetchAccountants = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, username, role')
      .eq('role', 'accountant');
    if (!error) setAccountants(data || []);
    setFetching(false);
  };

  useEffect(() => {
    if (!authLoading) fetchAccountants();
    // eslint-disable-next-line
  }, [authLoading]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (!email || !username || !password) {
      setError('Email, username, and password are required.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/create-accountant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create accountant.');
      } else {
        setSuccess('Accountant created successfully!');
        setEmail('');
        setUsername('');
        setPassword('');
        fetchAccountants(); // Refresh list
      }
    } catch (err) {
      setError('Network error.');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this accountant?')) return;
    setDeletingId(id);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/create-accountant', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to delete accountant.');
      } else {
        setSuccess('Accountant deleted successfully!');
        fetchAccountants();
      }
    } catch (err) {
      setError('Network error.');
    }
    setDeletingId(null);
  };

  if (authLoading) return null;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Manage Accountants</h2>
      <form onSubmit={handleAdd} className="mb-6">
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "View"}
            </button>
          </div>
        </div>
        {error && <div className="mb-2 text-red-500">{error}</div>}
        {success && <div className="mb-2 text-green-600">{success}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>
          {loading ? 'Adding...' : 'Add Accountant'}
        </button>
      </form>
      <h3 className="text-lg font-semibold mb-2">Accountant List</h3>
      {fetching ? (
        <div className="text-gray-500">Loading...</div>
      ) : accountants.length === 0 ? (
        <div className="text-gray-500">No accountants found.</div>
      ) : (
        <ul className="divide-y">
          {accountants.map(acc => (
            <li key={acc.id} className="py-2 flex justify-between items-center">
              <span>{acc.username} <span className="text-xs text-gray-500">({acc.email})</span></span>
              <span className="text-xs text-gray-500 mr-4">{acc.role}</span>
              <button
                onClick={() => handleDelete(acc.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                disabled={deletingId === acc.id}
              >
                {deletingId === acc.id ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-gray-500 text-sm mt-4">New accountants can now log in with their email and password.</p>
    </div>
  );
} 