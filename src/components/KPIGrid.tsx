import React from 'react';
import { motion } from 'motion/react';
import { KPI } from '../types';

interface KPIGridProps { 
  kpis: KPI[];
  onRemove?: (id: string) => void;
  onEdit?: (kpi: KPI) => void;
}

export const KPIGrid = ({ kpis, onRemove, onEdit }: KPIGridProps) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
    {kpis.map((k, i) => (
      <motion.div
        key={k.id}
        custom={i}
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
        className="rounded-2xl p-6 flex flex-col gap-3 cursor-default relative overflow-hidden group"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        {/* Subtle glow on hover */}
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
          style={{ background: 'linear-gradient(135deg, var(--primary)08, var(--accent)05)' }}
        />
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-20">
              {onEdit && (
                <button
                  onClick={() => onEdit(k)}
                  className="w-5 h-5 rounded-md flex items-center justify-center hover:scale-110"
                  style={{ background: 'var(--primary)20', color: 'var(--primary)', fontSize: '10px' }}
                  title="Editar KPI"
                >
                  ✎
                </button>
              )}
              {onRemove && (
                <button
                  onClick={() => onRemove(k.id)}
                  className="w-5 h-5 rounded-md flex items-center justify-center hover:scale-110"
                  style={{ background: '#DC262620', color: '#EF4444', fontSize: '10px', fontWeight: 'bold' }}
                  title="Remover KPI"
                >
                  ✕
                </button>
              )}
            </div>
        <div className="flex items-center justify-between relative z-10 pr-6">
          <span className="text-2xl">{k.icon}</span>
          {k.trend !== undefined && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 + 0.25 }}
              className="text-xs font-bold px-2.5 py-1 rounded-lg"
              style={{
                background: k.trendUp ? 'var(--primary)20' : '#DC262620',
                color: k.trendUp ? 'var(--accent)' : '#F87171',
              }}
            >
              {k.trendUp ? '↑' : '↓'} {k.trend?.toFixed(1)}%
            </motion.span>
          )}
        </div>
        <div className="relative z-10">
          <motion.p
            className="font-headline text-3xl font-bold leading-none"
            style={{ color: 'var(--text)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.06 + 0.15 }}
          >
            {k.value}{k.unit}
          </motion.p>
          <p className="text-xs mt-2 truncate" style={{ color: 'var(--text-muted)' }} title={k.label}>{k.label}</p>
        </div>
      </motion.div>
    ))}
  </div>
);
