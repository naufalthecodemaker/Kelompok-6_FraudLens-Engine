"use client";
import { Loader2 } from 'lucide-react';

export default function LoadingOverlay({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center transition-all animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200/80 flex flex-col items-center gap-4 max-w-xs w-full mx-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-bold text-slate-800 tracking-tight text-center">Sinkronisasi Jaringan Graph...</p>
      </div>
    </div>
  );
}
