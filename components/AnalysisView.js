"use client";
import { AlertTriangle, Check } from 'lucide-react';

export default function AnalysisView({ analysis }) {
  if (!analysis) return null;

  const { fraudPercentage, checklist } = analysis;
  
  let riskColor = 'text-emerald-600';
  let riskBg = 'bg-emerald-50 border-emerald-200';
  if (fraudPercentage > 0 && fraudPercentage <= 50) {
    riskColor = 'text-amber-600';
    riskBg = 'bg-amber-50 border-amber-200';
  } else if (fraudPercentage > 50) {
    riskColor = 'text-red-600';
    riskBg = 'bg-red-50 border-red-200';
  }

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 border border-slate-200/60 rounded-xl shadow-sm space-y-6">
      <div className={`flex items-center justify-between p-4 rounded-xl border ${riskBg}`}>
        <div>
          <h3 className={`font-bold text-lg ${riskColor}`}>Kemungkinan Fraud</h3>
          <p className="text-sm text-slate-600">Berdasarkan kalkulasi algoritma anomali graph.</p>
        </div>
        <div className={`text-4xl font-extrabold font-mono ${riskColor}`}>
          {fraudPercentage}%
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Data Pengecekan Sistem</h4>
        <div className="space-y-3">
          {checklist.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50 items-start transition-all">
              <div className="mt-0.5 shrink-0">
                {item.triggered ? (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                ) : (
                  <Check className="w-5 h-5 text-emerald-500" />
                )}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-bold ${item.triggered ? 'text-red-600' : 'text-slate-700'}`}>
                  {item.title}
                </div>
                <div className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {item.description}
                </div>
                
                {item.triggered && item.details && item.details.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-red-100">
                    <div className="text-[10px] font-bold text-red-800 uppercase tracking-wide mb-2">
                      {item.detailLabel}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.details.map((detail, idx) => (
                        <div key={idx} className="bg-red-100/80 border border-red-200 text-red-700 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm">
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
              </div>
              <div className="ml-2 shrink-0 flex items-center">
                {item.triggered ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-700 px-2 py-1 rounded">TERDETEKSI</span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">AMAN</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
