"use client";
import { useState, useEffect } from 'react';

export default function LinkForm({ caseId, nodes, onLinkAdded, triggerToast, setIsLoading }) {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [type, setType] = useState('OPENS_ACCOUNT');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (nodes.length > 0) {
      if (!sourceId || !nodes.find(n => n.id === sourceId)) setSourceId(nodes[0].id);
      if (!targetId || !nodes.find(n => n.id === targetId)) setTargetId(nodes[0].id);
    } else {
      setSourceId('');
      setTargetId('');
    }
  }, [nodes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sourceId || !targetId) {
      triggerToast('Entitas asal dan tujuan belum dipilih!', 'error');
      return;
    }
    if (sourceId === targetId) {
      triggerToast('Gagal: Entitas asal dan tujuan tidak boleh sama!', 'error');
      return;
    }
    if (!caseId) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId, targetId, type, amount, caseId })
      });
      const data = await res.json();
      if (data.success) {
        setAmount('');
        triggerToast('Relasi transaksi berhasil dihubungkan.', 'success');
        await onLinkAdded();
      } else {
        triggerToast('Gagal menghubungkan relasi.', 'error');
      }
    } catch (err) {
      triggerToast('Terjadi kesalahan koneksi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md p-5 border border-slate-200/60 rounded-xl space-y-4 shadow-sm">
      <h3 className="font-semibold text-slate-800 text-base">2. Mapping Relasi Sistem Transaksi</h3>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Entitas Asal (Subjek)</label>
        <select value={sourceId} onChange={(e) => setSourceId(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500" disabled={!caseId || nodes.length === 0}>
          {nodes.map(node => (
            <option key={node.id} value={node.id}>[{node.label}] {node.name} ({node.id})</option>
          ))}
          {nodes.length === 0 && <option>Belum ada entitas terdaftar</option>}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Jenis Relasi Perbankan</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500" disabled={!caseId}>
          <option value="OPENS_ACCOUNT">Membuka Akun (Customer → Account)</option>
          <option value="HAS_IDENTIFICATION">Memiliki Identitas (Customer → SSN)</option>
          <option value="USES_PHONE">Menggunakan Kontak (Customer → Phone)</option>
          <option value="LOGGED_IN_FROM">Akses Perangkat (Account → Device)</option>
          <option value="TRANSFERRED_TO">Aliran Dana Real-Time (Account → Account)</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Entitas Tujuan (Objek)</label>
        <select value={targetId} onChange={(e) => setTargetId(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500" disabled={!caseId || nodes.length === 0}>
          {nodes.map(node => (
            <option key={node.id} value={node.id}>[{node.label}] {node.name} ({node.id})</option>
          ))}
          {nodes.length === 0 && <option>Belum ada entitas terdaftar</option>}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Volume Transaksi (Khusus Transfer)</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Nominal Rp" className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" disabled={!caseId}/>
      </div>
      <button type="submit" disabled={!caseId || nodes.length === 0} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm">Hubungkan Transaksi</button>
    </form>
  );
}
