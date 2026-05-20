"use client";
import { useState } from 'react';

export default function NodeForm({ caseId, onNodeAdded, triggerToast, setIsLoading }) {
  const [label, setLabel] = useState('Customer');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({ id: false, name: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = { id: !id.trim(), name: !name.trim() };
    setErrors(newErrors);

    if (newErrors.id || newErrors.name) {
      triggerToast('Gagal: Harap isi kolom yang ditandai merah!', 'error');
      return;
    }

    if (!caseId) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, label, caseId })
      });
      const data = await res.json();
      if (data.success) {
        setId('');
        setName('');
        setErrors({ id: false, name: false });
        triggerToast('Entitas berhasil diregistrasi ke jaringan.', 'success');
        await onNodeAdded();
      } else {
        triggerToast('Gagal menyimpan entitas ke server.', 'error');
      }
    } catch (err) {
      triggerToast('Terjadi kesalahan koneksi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md p-5 border border-slate-200/60 rounded-xl space-y-4 shadow-sm">
      <h3 className="font-semibold text-slate-800 text-base">1. Registrasi Entitas Finansial</h3>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Komponen Grafik Identitas</label>
        <select value={label} onChange={(e) => setLabel(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500">
          <option value="Customer">Customer (Individu)</option>
          <option value="Account">Account (Nomor Rekening)</option>
          <option value="SSN">SSN / NIK (Identitas Negara)</option>
          <option value="Phone">Phone (Nomor Telepon)</option>
          <option value="Device">Device (Model/IP)</option>
        </select>
      </div>
      <div>
        <label className={`block text-xs font-medium mb-1 ${errors.id ? 'text-red-500' : 'text-slate-500'}`}>ID Unik Sistem {errors.id && '*'}</label>
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="Contoh: C001, ACC-99, SSN-123" className={`w-full border rounded-lg p-2 text-sm text-slate-800 focus:outline-none ${errors.id ? 'border-red-500 focus:border-red-600 bg-red-50' : 'border-slate-300 focus:border-blue-500'}`} disabled={!caseId}/>
        {errors.id && <p className="text-[10px] text-red-500 mt-1">ID Unik wajib diisi.</p>}
      </div>
      <div>
        <label className={`block text-xs font-medium mb-1 ${errors.name ? 'text-red-500' : 'text-slate-500'}`}>Atribut Identitas (Nama/Value) {errors.name && '*'}</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama orang, nomor asli, atau model/IP device" className={`w-full border rounded-lg p-2 text-sm text-slate-800 focus:outline-none ${errors.name ? 'border-red-500 focus:border-red-600 bg-red-50' : 'border-slate-300 focus:border-blue-500'}`} disabled={!caseId}/>
        {errors.name && <p className="text-[10px] text-red-500 mt-1">Atribut wajib diisi.</p>}
      </div>
      <button type="submit" disabled={!caseId} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm">Simpan ke Jaringan</button>
    </form>
  );
}
