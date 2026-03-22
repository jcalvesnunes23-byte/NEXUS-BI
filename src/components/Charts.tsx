import React, { useState, useRef, useCallback } from 'react';
import { ChartConfig } from '../types';

const CHART_H = 220;

interface ChartProps { config: ChartConfig; colors: string[]; onRemove?: (id: string) => void; }

const fmt = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n % 1 === 0 ? n.toLocaleString('pt-BR') : n.toFixed(2);
};

// ─── Tooltip flutuante ───────────────────────────────────────────────────────
interface TooltipState { visible: boolean; x: number; y: number; label: string; value: number; pct?: number; extra?: string; }
const initTooltip: TooltipState = { visible: false, x: 0, y: 0, label: '', value: 0 };

const Tooltip = ({ t }: { t: TooltipState }) => {
  if (!t.visible) return null;
  return (
    <div
      className="fixed z-50 pointer-events-none px-3 py-2 rounded-xl text-xs shadow-2xl"
      style={{
        left: t.x + 14, top: t.y - 10,
        background: 'rgba(12,8,30,0.96)',
        border: '1px solid rgba(139,92,246,0.4)',
        backdropFilter: 'blur(12px)',
        minWidth: 140,
        transform: t.x > window.innerWidth - 200 ? 'translateX(-120%)' : undefined,
      }}
    >
      <div className="font-bold mb-1" style={{ color: 'var(--text)' }}>{t.label}</div>
      <div style={{ color: '#a78bfa' }}>
        <span className="text-white font-bold">{fmt(t.value)}</span>
      </div>
      {t.pct !== undefined && (
        <div className="mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Participação: <span className="font-bold text-white">{t.pct.toFixed(1)}%</span>
        </div>
      )}
      {t.extra && <div className="mt-0.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>{t.extra}</div>}
    </div>
  );
};

// ─── Bar Chart ───────────────────────────────────────────────────────────────
const BarChart = ({ config, colors }: ChartProps) => {
  const [tooltip, setTooltip] = useState<TooltipState>(initTooltip);
  const total = config.data.reduce((a, d) => a + d.value, 0) || 1;
  const max = Math.max(...config.data.map(d => d.value), 1);
  const avg = total / config.data.length;

  return (
    <>
      <Tooltip t={tooltip} />
      {/* Totals bar header */}
      <div className="flex items-center justify-between mb-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
        <span>Total: <strong style={{ color: 'var(--text)' }}>{fmt(total)}</strong></span>
        <span>Média: <strong style={{ color: 'var(--text)' }}>{fmt(avg)}</strong></span>
        <span>Máx: <strong style={{ color: '#a78bfa' }}>{fmt(max)}</strong></span>
      </div>
      <div className="w-full">
        <div className="flex items-end gap-1.5 w-full" style={{ height: CHART_H }}>
          {config.data.map((d, i) => {
            const isAboveAvg = d.value >= avg;
            const color = isAboveAvg ? colors[0] : (colors[2] || '#a78bfa');
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end gap-1 cursor-pointer"
                style={{ height: '100%' }}
                onMouseMove={e => setTooltip({
                  visible: true, x: e.clientX, y: e.clientY,
                  label: d.label, value: d.value,
                  pct: (d.value / total) * 100,
                  extra: isAboveAvg ? `↑ ${(((d.value - avg) / avg) * 100).toFixed(1)}% acima da média` : `↓ ${(((avg - d.value) / avg) * 100).toFixed(1)}% abaixo da média`,
                })}
                onMouseLeave={() => setTooltip(initTooltip)}
              >
                <span className="text-[9px] font-bold" style={{ color: 'var(--text-muted)' }}>
                  {fmt(d.value)}
                </span>
                <div
                  className="w-full rounded-t-md transition-all duration-500 hover:brightness-125"
                  style={{
                    height: `${(d.value / max) * 82}%`,
                    background: `linear-gradient(180deg, ${color}, ${color}88)`,
                    minHeight: 4,
                    boxShadow: `0 0 12px ${color}40`,
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex gap-1.5 mt-2">
          {config.data.map((d, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[9px] block truncate" style={{ color: 'var(--text-muted)' }} title={d.label}>
                {d.label.slice(0, 10)}
              </span>
            </div>
          ))}
        </div>
        {/* Avg reference line visual */}
        <div className="mt-3 flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
          <div className="w-4 h-0.5 border-t border-dashed" style={{ borderColor: '#a78bfa80' }} />
          Linha de referência = média ({fmt(avg)})
        </div>
      </div>
    </>
  );
};

// ─── Line / Area Chart ───────────────────────────────────────────────────────
const LineChart = ({ config, colors }: ChartProps) => {
  const [tooltip, setTooltip] = useState<TooltipState>(initTooltip);
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 500, H = CHART_H, PAD = 32;
  const vals = config.data.map(d => d.value);
  const max = Math.max(...vals, 1);
  const min = Math.min(...vals, 0);
  const total = vals.reduce((a, b) => a + b, 0);
  const avg = total / vals.length;

  const pts = config.data.map((d, i) => ({
    x: PAD + (i / Math.max(config.data.length - 1, 1)) * (W - PAD * 2),
    y: H - PAD - ((d.value - min) / Math.max(max - min, 1)) * (H - PAD * 2),
    d,
  }));
  const pathD = `M ${pts.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const areaD = `M ${pts[0].x},${H - PAD} L ${pts.map(p => `${p.x},${p.y}`).join(' L ')} L ${pts[pts.length - 1].x},${H - PAD} Z`;
  const avgY = H - PAD - ((avg - min) / Math.max(max - min, 1)) * (H - PAD * 2);

  return (
    <>
      <Tooltip t={tooltip} />
      <div className="flex items-center justify-between mb-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
        <span>Total: <strong style={{ color: 'var(--text)' }}>{fmt(total)}</strong></span>
        <span>Média: <strong style={{ color: 'var(--text)' }}>{fmt(avg)}</strong></span>
        <span>Pico: <strong style={{ color: '#a78bfa' }}>{fmt(max)}</strong></span>
      </div>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: CHART_H }}>
        <defs>
          <linearGradient id={`lg-${config.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors[0]} stopOpacity="0.4" />
            <stop offset="100%" stopColor={colors[0]} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path d={areaD} fill={`url(#lg-${config.id})`} />
        {/* Average reference line */}
        <line x1={PAD} y1={avgY} x2={W - PAD} y2={avgY} stroke="#a78bfa" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
        <text x={W - PAD + 2} y={avgY + 4} fontSize="9" fill="#a78bfa" opacity="0.75">avg</text>
        {/* Main line */}
        <path d={pathD} fill="none" stroke={colors[0]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Data points */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x} cy={p.y} r="14" fill="transparent"
              className="cursor-pointer"
              onMouseMove={e => setTooltip({
                visible: true, x: e.clientX, y: e.clientY,
                label: p.d.label, value: p.d.value,
                extra: i > 0 ? `vs anterior: ${p.d.value >= pts[i-1].d.value ? '▲' : '▼'} ${Math.abs(((p.d.value - pts[i-1].d.value) / (pts[i-1].d.value || 1)) * 100).toFixed(1)}%` : 'Primeiro ponto',
              })}
              onMouseLeave={() => setTooltip(initTooltip)}
            />
            <circle cx={p.x} cy={p.y} r="4" fill={colors[0]} stroke="var(--bg)" strokeWidth="2" pointerEvents="none" />
          </g>
        ))}
      </svg>
    </>
  );
};

// ─── Donut Chart ─────────────────────────────────────────────────────────────
const DonutChart = ({ config, colors }: ChartProps) => {
  const [tooltip, setTooltip] = useState<TooltipState>(initTooltip);
  const [hovered, setHovered] = useState<number | null>(null);
  const total = config.data.reduce((a, d) => a + d.value, 0) || 1;
  const R = 65, r = 38, cx = 85, cy = 80;
  let angle = -Math.PI / 2;
  const slices = config.data.slice(0, 8).map((d, i) => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle), y1 = cy + R * Math.sin(angle);
    angle += sweep;
    const x2 = cx + R * Math.cos(angle), y2 = cy + R * Math.sin(angle);
    const ix1 = cx + r * Math.cos(angle - sweep), iy1 = cy + r * Math.sin(angle - sweep);
    const ix2 = cx + r * Math.cos(angle), iy2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r} ${r} 0 ${large} 0 ${ix1} ${iy1} Z`;
    return { path, color: colors[i % colors.length], label: d.label, value: d.value, pct: (d.value / total) * 100 };
  });

  return (
    <>
      <Tooltip t={tooltip} />
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 170 160" className="shrink-0" style={{ width: 140, height: 130 }}>
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="9" fill="var(--text-muted)">Total</text>
          <text x={cx} y={cy + 8} textAnchor="middle" fontSize="12" fontWeight="bold" fill="var(--text)">{fmt(total)}</text>
          {slices.map((s, i) => (
            <path
              key={i}
              d={s.path}
              fill={s.color}
              opacity={hovered === null || hovered === i ? 1 : 0.4}
              className="cursor-pointer transition-all"
              transform={hovered === i ? `translate(${Math.cos((angle - Math.PI / 2) / slices.length) * 4}, ${Math.sin((angle - Math.PI / 2) / slices.length) * 4})` : ''}
              onMouseMove={e => {
                setHovered(i);
                setTooltip({ visible: true, x: e.clientX, y: e.clientY, label: s.label, value: s.value, pct: s.pct });
              }}
              onMouseLeave={() => { setHovered(null); setTooltip(initTooltip); }}
            />
          ))}
        </svg>
        <div className="flex-1 space-y-1.5 min-w-0">
          {slices.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-2 cursor-pointer rounded-lg px-1.5 py-0.5 transition-all"
              style={{ background: hovered === i ? `${s.color}15` : 'transparent' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
              <span className="text-[10px] truncate flex-1" style={{ color: 'var(--text-muted)' }} title={s.label}>{s.label}</span>
              <span className="text-[10px] font-bold shrink-0" style={{ color: 'var(--text)' }}>{fmt(s.value)}</span>
              <span className="text-[10px] shrink-0" style={{ color: s.color }}>{s.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ─── ChartWidget wrapper ──────────────────────────────────────────────────────
export const ChartWidget = ({ config, colors, onRemove }: ChartProps) => {
  const renderChart = () => {
    switch (config.type) {
      case 'bar': return <BarChart config={config} colors={colors} />;
      case 'line': case 'area': return <LineChart config={config} colors={colors} />;
      case 'pie': case 'donut': return <DonutChart config={config} colors={colors} />;
      default: return <BarChart config={config} colors={colors} />;
    }
  };

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-3 group relative overflow-visible"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      {onRemove && (
        <button
          onClick={() => onRemove(config.id)}
          className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 hover:scale-110"
          style={{ background: '#DC262620', color: '#EF4444' }}
          title="Remover gráfico"
        >✕</button>
      )}
      <div className="pr-6">
        <h4 className="font-headline text-sm font-bold" style={{ color: 'var(--text)' }}>{config.title}</h4>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{config.description}</p>
      </div>
      {renderChart()}
    </div>
  );
};
