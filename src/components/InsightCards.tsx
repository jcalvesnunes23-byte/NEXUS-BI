import React from 'react';
import { motion } from 'motion/react';
import { InsightCard } from '../types';
import { Lightbulb, TrendingUp, AlertTriangle, Star, RefreshCw } from 'lucide-react';

interface InsightCardsProps {
  insights: InsightCard[];
  loading?: boolean;
  onRegenerate?: () => void;
  onRemove?: (id: string) => void;
}

const typeConfig = {
  trend: { icon: <TrendingUp size={16} />, color: 'var(--accent)', bg: 'var(--primary)15' },
  alert: { icon: <AlertTriangle size={16} />, color: '#F59E0B', bg: '#F59E0B15' },
  suggestion: { icon: <Lightbulb size={16} />, color: '#60A5FA', bg: '#60A5FA15' },
  highlight: { icon: <Star size={16} />, color: '#34D399', bg: '#34D39915' },
};

export const InsightCards = ({ insights, loading, onRegenerate, onRemove }: InsightCardsProps) => (
  <div>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between mb-4"
    >
      <h3 className="font-headline text-xl font-bold" style={{ color: 'var(--text)' }}>
        💡 Insights Estratégicos
      </h3>
      {onRegenerate && (
        <button
          onClick={onRegenerate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-80 hover:scale-105"
          style={{ background: 'var(--primary)20', color: 'var(--accent)' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Analisando...' : 'Novo Insight'}
        </button>
      )}
    </motion.div>

    {loading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl p-6 h-36 animate-shimmer" style={{ background: 'var(--bg-card)' }} />
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {insights.map((ins, i) => {
          const cfg = typeConfig[ins.type];
          return (
            <motion.div
              key={ins.id}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="rounded-2xl p-6 flex flex-col gap-3 relative group"
              style={{ background: 'var(--bg-card)', border: `1px solid ${cfg.color}30` }}
            >
              {onRemove && (
                 <button
                   onClick={() => onRemove(ins.id)}
                   className="absolute top-3 right-3 w-5 h-5 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110"
                   style={{ background: '#DC262620', color: '#EF4444', fontSize: '10px', fontWeight: 'bold' }}
                   title="Remover Insight"
                 >
                   ✕
                 </button>
              )}
              <div className="flex items-center gap-2.5 pr-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.08 + 0.2, type: 'spring', stiffness: 200 }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.icon}
                </motion.div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: cfg.color }}>
                  INSIGHT #{ins.number}
                </span>
              </div>
              <p className="font-headline text-sm font-bold leading-snug" style={{ color: 'var(--text)' }}>{ins.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{ins.text}</p>
              {ins.action && (
                <p className="text-xs font-bold pt-2 border-t" style={{ color: cfg.color, borderColor: `${cfg.color}30` }}>
                  → {ins.action}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    )}
  </div>
);
