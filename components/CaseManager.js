"use client";
import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function CaseManager({ userId, activeCaseId, onCaseSelect, triggerToast, setIsLoading }) {
  const [cases, setCases] = useState([]);
  const [newCaseName, setNewCaseName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [caseToDelete, setCaseToDelete] = useState(null);

  const fetchCases = async () => {
    try {
      const res = await fetch(`/api/cases?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setCases(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) fetchCases();
  }, [userId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCaseName.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name: newCaseName, caseName: newCaseName })
      });
      const data = await res.json();
      if (data.success) {
        setNewCaseName('');
        await fetchCases();
        triggerToast('Kasus investigasi baru berhasil dibuat.', 'success');
      } else {
        triggerToast('Gagal membuat kasus baru.', 'error');
      }
    } catch (err) {
      triggerToast('Terjadi kesalahan sistem.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const executeDelete = async (id) => {
    setCaseToDelete(null);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cases?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (activeCaseId === id) onCaseSelect(null);
        await fetchCases();
        triggerToast('Kasus berhasil dihapus dari sistem.', 'success');
      } else {
        triggerToast('Gagal menghapus kasus.', 'error');
      }
    } catch (err) {
      triggerToast('Terjadi kesalahan sistem.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const submitEdit = async (e, id) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/cases', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: editName, caseName: editName })
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        await fetchCases();
        triggerToast('Nama kasus berhasil diperbarui.', 'success');
      } else {
        triggerToast('Gagal memperbarui nama kasus.', 'error');
      }
    } catch (err) {
      triggerToast('Terjadi kesalahan sistem.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-5 border border-slate-200/60 rounded-xl space-y-4 shadow-sm">
      <h3 className="font-semibold text-slate-800 text-base">Daftar Riwayat Kasus</h3>
      
      <form onSubmit={handleCreate} className="flex gap-2">
        <input 
          type="text" 
          value={newCaseName || ''} 
          onChange={(e) => setNewCaseName(e.target.value)} 
          placeholder="Nama investigasi baru..." 
          className="flex-1 border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm">Buat</button>
      </form>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {cases.length === 0 ? (
          <p className="text-xs text-slate-500 italic">Belum ada riwayat kasus.</p>
        ) : (
          cases.map(c => {
            const displayTitle = c.name || c.caseName || c.title || 'Kasus Tanpa Nama';
            
            return (
              <div 
                key={c.id} 
                onClick={() => onCaseSelect(c.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col gap-2.5 ${activeCaseId === c.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
              >
                {editingId === c.id ? (
                  <form onSubmit={(e) => submitEdit(e, c.id)} className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="text" 
                      value={editName || ''} 
                      onChange={(e) => setEditName(e.target.value)} 
                      autoFocus
                      className="w-full border border-slate-300 rounded p-1.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setEditingId(null)} className="text-xs bg-slate-200 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-300 font-medium transition-colors">Batal</button>
                      <button type="submit" className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded hover:bg-emerald-200 font-medium transition-colors">Simpan</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="text-sm font-bold leading-snug break-words text-slate-700">
                      {displayTitle}
                    </div>
                    <div className="flex justify-end gap-4 text-xs border-t border-slate-200/60 pt-2 mt-auto">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingId(c.id); setEditName(displayTitle); }} 
                        className="text-slate-400 hover:text-blue-600 font-bold tracking-wide transition-colors uppercase"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setCaseToDelete(c.id); }} 
                        className="text-slate-400 hover:text-red-600 font-bold tracking-wide transition-colors uppercase"
                      >
                        Hapus
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {caseToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[10000] flex items-center justify-center animate-fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200/80 max-w-sm w-full mx-4 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="font-bold text-base text-slate-900 tracking-tight">Konfirmasi Hapus Kasus</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Apakah Anda yakin ingin menghapus kasus ini? Seluruh entitas komponen finansial dan peta mapping relasi transaksi di dalamnya akan dihapus permanen dari database Neo4j.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setCaseToDelete(null)} 
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={() => executeDelete(caseToDelete)} 
                className="text-xs bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm"
              >
                Hapus Kasus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}