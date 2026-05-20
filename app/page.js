"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CaseManager from '@/components/CaseManager';
import NodeForm from '@/components/NodeForm';
import LinkForm from '@/components/LinkForm';
import NetworkManager from '@/components/NetworkManager';
import GraphCanvas from '@/components/GraphCanvas';
import AnalysisView from '@/components/AnalysisView';
import Toast from '@/components/Toast';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [analysis, setAnalysis] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('fraudlens_user');
    if (!storedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const refreshDashboard = async () => {
    if (!activeCaseId) {
      setGraphData({ nodes: [], links: [] });
      setAnalysis(null);
      return;
    }
    setIsLoading(true);
    try {
      const [graphRes, analysisRes] = await Promise.all([
        fetch(`/api/graph?caseId=${activeCaseId}`).then(res => res.json()),
        fetch(`/api/analysis?caseId=${activeCaseId}`).then(res => res.json())
      ]);
      if (graphRes.success) setGraphData(graphRes.data);
      if (analysisRes.success) setAnalysis(analysisRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshDashboard();
  }, [activeCaseId]);

  const handleLogout = () => {
    localStorage.removeItem('fraudlens_user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-transparent text-slate-800 font-sans p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="border-b border-slate-200/60 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">FraudLens Engine</h1>
            <p className="text-slate-500 mt-1">Platform Intelijen Identitas & Deteksi Kriminologi Keuangan Digital</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">Investigator</div>
              <div className="text-xs text-slate-500">@{user.username}</div>
            </div>
            <button onClick={handleLogout} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-2 rounded-lg border border-red-200 transition-colors">Logout</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-1">
            <CaseManager userId={user.id} activeCaseId={activeCaseId} onCaseSelect={setActiveCaseId} triggerToast={triggerToast} setIsLoading={setIsLoading} />
            <NodeForm caseId={activeCaseId} onNodeAdded={refreshDashboard} triggerToast={triggerToast} setIsLoading={setIsLoading} />
            <LinkForm caseId={activeCaseId} nodes={graphData.nodes} onLinkAdded={refreshDashboard} triggerToast={triggerToast} setIsLoading={setIsLoading} />
            {activeCaseId && <NetworkManager caseId={activeCaseId} data={graphData} onElementDeleted={refreshDashboard} triggerToast={triggerToast} setIsLoading={setIsLoading} />}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {activeCaseId ? (
              <>
                <GraphCanvas data={graphData} />
                <AnalysisView analysis={analysis} onReset={refreshDashboard} />
              </>
            ) : (
              <div className="bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl h-[600px] flex items-center justify-center text-slate-400 font-medium text-sm">
                Silakan pilih atau buat kasus baru di panel kiri untuk memulai analisis investigasi.
              </div>
            )}
          </div>
        </div>

      </div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <LoadingOverlay isLoading={isLoading} />
    </div>
  );
}
