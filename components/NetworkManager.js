"use client";
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

export default function NetworkManager({ caseId, data, onElementDeleted, triggerToast }) {
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, targetData: null });

  const executeDeleteNode = async () => {
    const id = modalConfig.targetData;
    const res = await fetch(`/api/nodes?id=${id}&caseId=${caseId}`, { method: 'DELETE' });
    const resData = await res.json();
    if (resData.success) {
      onElementDeleted();
      triggerToast('Entitas berhasil dihapus.', 'success');
    }
    setModalConfig({ isOpen: false, type: null, targetData: null });
  };

  const executeDeleteLink = async () => {
    const link = modalConfig.targetData;
    const res = await fetch('/api/links', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId: link.source, targetId: link.target, type: link.type, caseId })
    });
    const resData = await res.json();
    if (resData.success) {
      onElementDeleted();
      triggerToast('Hubungan transaksi diputus.', 'success');
    }
    setModalConfig({ isOpen: false, type: null, targetData: null });
  };

  return (
    <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-sm max-h-96 overflow-y-auto">
      <h3 className="font-semibold text-slate-800 text-base">Data Komponen Grafik Aktif</h3>
      
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daftar Entitas ({data.nodes.length})</h4>
        {data.nodes.map(node => (
          <div key={node.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs">
            <span className="text-slate-700 font-medium truncate">[{node.label}] {node.name} ({node.id})</span>
            <button onClick={() => setModalConfig({ isOpen: true, type: 'node', targetData: node.id })} className="text-red-500 hover:text-red-700 font-bold ml-2">Hapus</button>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daftar Relasi Transaksi ({data.links.length})</h4>
        {data.links.map((link, idx) => (
          <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs">
            <span className="text-slate-600 truncate">{link.source} → {link.type} → {link.target}</span>
            <button onClick={() => setModalConfig({ isOpen: true, type: 'link', targetData: link })} className="text-red-500 hover:text-red-700 font-bold ml-2">Putus</button>
          </div>
        ))}
      </div>

      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.type === 'node' ? 'Hapus Entitas' : 'Putus Relasi'}
        message={modalConfig.type === 'node' ? 'Hapus entitas ini? Semua relasi transaksi yang terhubung pada entitas ini otomatis akan terputus.' : 'Apakah Anda yakin ingin memutuskan hubungan transaksi ini?'}
        onConfirm={modalConfig.type === 'node' ? executeDeleteNode : executeDeleteLink}
        onCancel={() => setModalConfig({ isOpen: false, type: null, targetData: null })}
      />
    </div>
  );
}
 