"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginCard() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('fraudlens_user', JSON.stringify(data.user));
      router.push('/');
    } else {
      setError(data.error);
    }
  };

  return (
    <form onSubmit={handleLogin} className="bg-white p-6 border border-slate-200 rounded-xl shadow-md w-full max-w-sm space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 text-center">Login FraudLens</h2>
      {error && <p className="text-red-600 text-xs text-center font-medium">{error}</p>}
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" required />
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors">Masuk Aplikasi</button>
      <p className="text-xs text-center text-slate-500">Belum punya akun? <a href="/register" className="text-blue-600 font-medium">Daftar</a></p>
    </form>
  );
}
