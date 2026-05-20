"use client";
import dynamic from 'next/dynamic';
import { useRef, useEffect, useState, useCallback } from 'react';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

const NODE_COLORS = {
  Customer: '#ef4444',
  Account: '#f59e0b',
  SSN: '#a855f7',
  Phone: '#ec4899',
  Device: '#3b82f6',
  Default: '#94a3b8'
};

export default function GraphCanvas({ data }) {
  const fgRef = useRef();
  const [displayData, setDisplayData] = useState({ nodes: [], links: [] });
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    if (data && data.nodes) {
      setDisplayData({
        nodes: data.nodes.map(n => ({ ...n })),
        links: data.links.map(l => ({ ...l }))
      });
    }
  }, [data]);

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-120);
      fgRef.current.d3Force('link').distance(55);
      fgRef.current.d3Force('center').strength(1.0);
      
      setTimeout(() => {
        if (fgRef.current) fgRef.current.zoomToFit(300, 40);
      }, 400);
    }
  }, [displayData]);

  const paintLinkHoverLabel = useCallback((link, ctx, globalScale) => {
    const isHovered = link === hoveredLink;
    if (!isHovered) return;

    const start = link.source;
    const end = link.target;
    if (typeof start !== 'object' || typeof end !== 'object') return;

    const relFontSize = 3.0;
    const scaleFactor = 10;
    const x = (start.x + end.x) / 2;
    const y = (start.y + end.y) / 2;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1 / scaleFactor, 1 / scaleFactor);
    ctx.font = `700 ${relFontSize * scaleFactor}px var(--font-orbitron), sans-serif`;

    const label = link.type;
    const textWidth = ctx.measureText(label).width;
    const padding = 1.5 * scaleFactor;
    
    const rectX = -textWidth / 2 - padding;
    const rectY = -(relFontSize * scaleFactor) / 2 - padding;
    const rectW = textWidth + padding * 2;
    const rectH = (relFontSize * scaleFactor) + padding * 2;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.fillRect(rectX, rectY, rectW, rectH);
    
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 0.5 * scaleFactor;
    ctx.strokeRect(rectX, rectY, rectW, rectH);

    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 0);
    ctx.restore();

  }, [hoveredLink]);

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-xl overflow-hidden h-[600px] relative flex items-center justify-center">
      
      <div className="absolute top-4 left-4 z-10 bg-white/95 p-3 rounded-xl border border-slate-200/60 text-xs shadow-lg backdrop-blur-sm pointer-events-none">
        <div className="font-bold mb-2 border-b border-slate-200/60 pb-1 text-slate-900 tracking-tight">Keterangan Graph</div>
        {Object.entries(NODE_COLORS).map(([key, color]) => (
          key !== 'Default' && (
            <div key={key} className="flex items-center gap-2.5 mt-1.5 text-slate-700 font-medium">
              <span className="w-3 h-3 rounded-full" style={{backgroundColor: color}}></span>
              {key === 'SSN' ? 'SSN / NIK' : key}
            </div>
          )
        ))}
      </div>

      {displayData.nodes.length === 0 ? (
        <div className="text-slate-400 font-medium text-sm">
          Grafik kosong. Silakan registrasi entitas finansial di panel kiri.
        </div>
      ) : (
        <ForceGraph2D
          ref={fgRef}
          graphData={displayData}
          backgroundColor="transparent"
          nodeRelSize={6}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.name || node.id || '';
            const labelFontSize = 3.2;
            const scaleFactor = 10;
            const radius = 6;
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = NODE_COLORS[node.label] || NODE_COLORS.Default;
            ctx.fill();
            ctx.lineWidth = 0.8;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            ctx.save();
            ctx.translate(node.x, node.y + radius + 4.5);
            ctx.scale(1 / scaleFactor, 1 / scaleFactor);
            ctx.font = `700 ${labelFontSize * scaleFactor}px var(--font-orbitron), sans-serif`;
            ctx.fillStyle = '#0f172a';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, 0, 0);
            ctx.restore();
          }}
          linkCanvasObject={paintLinkHoverLabel}
          linkCanvasObjectMode={() => 'after'}
          linkColor={link => link === hoveredLink ? '#0f172a' : '#cbd5e1'}
          lineWidth={link => link === hoveredLink ? 1.2 : 0.6}
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
          onLinkHover={setHoveredLink}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          enableNodeDrag={true}
        />
      )}
    </div>
  );
}
