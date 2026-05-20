"use client";
import { useEffect } from 'react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center p-4 rounded-xl border shadow-lg max-w-sm bg-white border-slate-200 transition-all duration-300 animate-slide-up`}>
      <div className="flex items-center gap-3">
        <span className={`w-2.5 h-2.5 rounded-full ${type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
        <p className="text-sm font-semibold text-slate-800">{message}</p>
      </div>
      <button onClick={onClose} className="ml-6 text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
    </div>
  );
}
