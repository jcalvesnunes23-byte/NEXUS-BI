import React, { useState } from 'react';
import { SheetData, KPI, ChartConfig, ChartType } from '../types';
import { X, BarChart2, PieChart, Activity, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface WidgetBuilderModalProps {
  data: SheetData;
  onClose: () => void;
  onAddKPI: (kpi: KPI) => void;
  onAddChart: (chart: ChartConfig) => void;
}

export const WidgetBuilderModal = ({ data, onClose, onAddKPI, onAddChart }: WidgetBuilderModalProps) => {
  const [tab, setTab] = useState<'chart' | 'kpi'>('chart');
  
  // KPI
  const [kpiCol, setKpiCol] = useState('');
  const [kpiTitle, setKpiTitle] = useState('');
  
  // Chart
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [chartTitle, setChartTitle] = useState('');
  const [xCol, setXCol] = useState('');
  const [yCol, setYCol] = useState('');

  const numericCols = data.columns.filter(c => c.type === 'numeric');
  const catDateCols = data.columns.filter(c => c.type === 'categorical' || c.type === 'date');

  const handleAddKPI = () => {
    if (!kpiCol) return;
    const col = data.columns.find(c => c.name === kpiCol);
    if (!col) return;
    const nums = col.values.filter(v => typeof v === 'number') as number[];
    const sum = nums.reduce((a, b) => a + b, 0);
    
    const kpi: KPI = {
      id: `manual-kpi-${Date.now()}`,
      label: kpiTitle || col.name,
      value: sum >= 1000000 ? (sum/1000000).toFixed(1) + 'M' : sum >= 1000 ? (sum/1000).toFixed(1) + 'K' : sum.toFixed(sum % 1 === 0 ? 0 : 2),
      rawValue: sum,
      icon: '📊',
      column: col.name
    };
    onAddKPI(kpi);
  };

  const handleAddChart = () => {
    if (!xCol || !yCol) return;
    const cx = data.columns.find(c => c.name === xCol);
    const cy = data.columns.find(c => c.name === yCol);
    if (!cx || !cy) return;
    
    const map = new Map<string, number>();
    for (let i = 0; i < data.rowCount; i++) {
        const xVal = String(cx.values[i] || 'Outros');
        const yVal = Number(cy.values[i]) || 0;
        map.set(xVal, (map.get(xVal) || 0) + yVal);
    }
    
    // Sort and keep top 10
    const sorted = Array.from(map.entries()).sort((a,b) => b[1] - a[1]).slice(0, 10);
    
    const chart: ChartConfig = {
      id: `manual-chart-${Date.now()}`,
      type: chartType,
      title: chartTitle || `${cy.name} por ${cx.name}`,
      description: 'Gerado manualmente',
      xColumn: cx.name,
      yColumn: cy.name,
      data: sorted.map(([l, v]) => ({ label: l, value: v }))
    };
    onAddChart(chart);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          <h2 className="text-xl font-bold font-headline" style={{ color: 'var(--text)' }}>Novo Elemento</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 p-1 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setTab('chart')}
              className="flex-1 py-2 text-sm font-bold rounded-lg transition-all"
              style={{ background: tab === 'chart' ? 'var(--primary)' : 'transparent', color: tab === 'chart' ? '#fff' : 'var(--text-muted)' }}
            >
              Gráfico
            </button>
            <button
              onClick={() => setTab('kpi')}
              className="flex-1 py-2 text-sm font-bold rounded-lg transition-all"
              style={{ background: tab === 'kpi' ? 'var(--primary)' : 'transparent', color: tab === 'kpi' ? '#fff' : 'var(--text-muted)' }}
            >
              Cartão KPI
            </button>
          </div>

          {tab === 'chart' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Título (Opcional)</label>
                <input
                  type="text"
                  value={chartTitle}
                  onChange={e => setChartTitle(e.target.value)}
                  placeholder="Ex: Faturamento por Estado"
                  className="w-full bg-transparent px-4 py-3 rounded-xl outline-none"
                  style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Tipo de Gráfico</label>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => setChartType('bar')} className="p-3 rounded-xl border flex flex-col items-center gap-2 transition-all hover:border-purple-500" style={{ borderColor: chartType === 'bar' ? 'var(--primary)' : 'var(--border)', background: chartType === 'bar' ? 'var(--primary)10' : 'transparent', color: chartType === 'bar' ? 'var(--primary)' : 'var(--text)' }}>
                    <BarChart2 size={24} /> <span className="text-xs">Barra</span>
                  </button>
                  <button onClick={() => setChartType('line')} className="p-3 rounded-xl border flex flex-col items-center gap-2 transition-all hover:border-purple-500" style={{ borderColor: chartType === 'line' ? 'var(--primary)' : 'var(--border)', background: chartType === 'line' ? 'var(--primary)10' : 'transparent', color: chartType === 'line' ? 'var(--primary)' : 'var(--text)' }}>
                    <Activity size={24} /> <span className="text-xs">Linha</span>
                  </button>
                  <button onClick={() => setChartType('donut')} className="p-3 rounded-xl border flex flex-col items-center gap-2 transition-all hover:border-purple-500" style={{ borderColor: chartType === 'donut' ? 'var(--primary)' : 'var(--border)', background: chartType === 'donut' ? 'var(--primary)10' : 'transparent', color: chartType === 'donut' ? 'var(--primary)' : 'var(--text)' }}>
                    <PieChart size={24} /> <span className="text-xs">Rosca</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Eixo X (Categorias)</label>
                  <select value={xCol} onChange={e => setXCol(e.target.value)} className="w-full bg-transparent px-4 py-3 rounded-xl outline-none appearance-none" style={{ border: '1px solid var(--border)', color: 'var(--text)' }}>
                    <option value="" disabled>Selecione</option>
                    {catDateCols.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    <option disabled>--- Numéricas ---</option>
                    {numericCols.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Eixo Y (Valores/Soma)</label>
                  <select value={yCol} onChange={e => setYCol(e.target.value)} className="w-full bg-transparent px-4 py-3 rounded-xl outline-none appearance-none" style={{ border: '1px solid var(--border)', color: 'var(--text)' }}>
                    <option value="" disabled>Selecione</option>
                    {numericCols.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={handleAddChart}
                disabled={!xCol || !yCol}
                className="w-full py-3.5 mt-4 rounded-xl font-bold text-white transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
              >
                Salvar Gráfico
              </button>
            </div>
          )}

          {tab === 'kpi' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Título do Cartão</label>
                <input
                  type="text"
                  value={kpiTitle}
                  onChange={e => setKpiTitle(e.target.value)}
                  placeholder="Ex: Faturamento Total"
                  className="w-full bg-transparent px-4 py-3 rounded-xl outline-none"
                  style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Coluna de Valor (Soma)</label>
                <select value={kpiCol} onChange={e => setKpiCol(e.target.value)} className="w-full bg-transparent px-4 py-3 rounded-xl outline-none appearance-none" style={{ border: '1px solid var(--border)', color: 'var(--text)' }}>
                  <option value="" disabled>Selecione a Métrica</option>
                  {numericCols.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg mt-2" style={{ background: 'var(--bg-card)', border: '1px dashed var(--border)' }}>
                <Info size={16} style={{ color: 'var(--primary)' }} className="shrink-0 mt-0.5" />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>O sistema irá somar todos os valores preenchidos na coluna selecionada para exibir neste cartão.</span>
              </div>

              <button
                onClick={handleAddKPI}
                disabled={!kpiCol}
                className="w-full py-3.5 mt-4 rounded-xl font-bold text-white transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
              >
                Adicionar Cartão KPI
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
