import React, { useState, useEffect } from 'react';
import { SheetData, KPI } from '../types';
import { X, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { recalculateKPI } from '../hooks/useSpreadsheet';

interface KPIEditorModalProps {
  kpi: KPI;
  data: SheetData;
  onClose: () => void;
  onSave: (updatedKpi: KPI) => void;
}

export const KPIEditorModal = ({ kpi, data, onClose, onSave }: KPIEditorModalProps) => {
  const [label, setLabel] = useState(kpi.label);
  const [column, setColumn] = useState(kpi.column);
  const [aggregation, setAggregation] = useState<'sum' | 'avg' | 'count'>(kpi.aggregation || 'sum');

  const numericCols = data.columns.filter(c => c.type === 'numeric');
  const allCols = data.columns.filter(c => c.type !== 'date'); // for count we can use any non-date

  const handleSave = () => {
    const updated = recalculateKPI(kpi, data, label, column, aggregation);
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          <h2 className="text-xl font-bold font-headline" style={{ color: 'var(--text)' }}>Editar KPI</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Título do Cartão</label>
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="w-full bg-transparent px-4 py-3 rounded-xl outline-none"
              style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Lógica de Cálculo (Agregação)</label>
            <select 
              value={aggregation} 
              onChange={e => setAggregation(e.target.value as 'sum'|'avg'|'count')} 
              className="w-full bg-transparent px-4 py-3 rounded-xl outline-none appearance-none" 
              style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              <option value="sum" style={{ color: 'black' }}>Soma (Sum)</option>
              <option value="avg" style={{ color: 'black' }}>Média (Average)</option>
              <option value="count" style={{ color: 'black' }}>Contagem (Count)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Coluna Base</label>
            <select 
               value={column} 
               onChange={e => setColumn(e.target.value)} 
               className="w-full bg-transparent px-4 py-3 rounded-xl outline-none appearance-none" 
               style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              <option value="" disabled>Selecione a Métrica</option>
              {(aggregation === 'count' ? allCols : numericCols).map(c => <option key={c.name} value={c.name} style={{ color: 'black' }}>{c.name}</option>)}
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={!column || !label}
            className="w-full py-3.5 mt-4 rounded-xl font-bold text-white transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
          >
            Salvar Alterações
          </button>
        </div>
      </motion.div>
    </div>
  );
};
