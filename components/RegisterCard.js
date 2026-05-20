"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterCard() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok!');
      return;
    }
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) router.push('/login');
    else setError(data.error);
  };

  return (
    <form onSubmit={handleRegister} className="bg-white p-6 border border-slate-200 rounded-xl shadow-md w-full max-w-sm space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 text-center">Daftar FraudLens</h2>
      {error && <p className="text-red-600 text-xs text-center font-medium">{error}</p>}
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" required />
      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Konfirmasi Password" className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" required />
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors">Registrasi Akun</button>
      <p className="text-xs text-center text-slate-500">Sudah punya akun? <a href="/login" className="text-blue-600 font-medium">Login</a></p>
    </form>
  );
}
