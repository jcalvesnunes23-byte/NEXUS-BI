import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { SheetData, KPI, ChartConfig, InsightCard, ThemeColors } from '../types';
import { Download, Loader2, Edit2, Filter } from 'lucide-react';
import { KPIGrid } from '../components/KPIGrid';
import { ChartWidget } from '../components/Charts';
import { InsightCards } from '../components/InsightCards';
import { FilterPanel } from '../components/FilterPanel';
import { DataEditorModal } from '../components/DataEditorModal';
import { WidgetBuilderModal } from '../components/WidgetBuilderModal';
import { KPIEditorModal } from '../components/KPIEditorModal';
import { generateKPIs, generateCharts, generateLocalInsights, applyFilters, recalculateChart, recalculateKPI } from '../hooks/useSpreadsheet';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardPageProps {
  data: SheetData;
  theme: ThemeColors;
  title: string;
  onUpdateData?: (newData: SheetData) => void;
  mode?: 'auto' | 'manual' | 'saved';
  savedKpis?: KPI[];
  savedCharts?: ChartConfig[];
  savedInsights?: InsightCard[];
  onChangeElements?: (kpis: KPI[], charts: ChartConfig[], insights: InsightCard[]) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }
  })
};

export const DashboardPage = ({ 
  data, theme, title, onUpdateData, mode = 'auto', 
  savedKpis, savedCharts, savedInsights, onChangeElements 
}: DashboardPageProps) => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KPI | null>(null);
  const [ready, setReady] = useState(false);

  const hasActiveFilters = React.useMemo(() => Object.values(activeFilters).some(v => v !== ''), [activeFilters]);

  const filteredData = React.useMemo(() => {
    if (!data || !hasActiveFilters) return data;
    return applyFilters(data, activeFilters);
  }, [data, activeFilters, hasActiveFilters]);

  const displayKpis = React.useMemo(() => {
    if (!hasActiveFilters || !filteredData) return kpis;
    return kpis.map(k => {
      let agg: 'sum' | 'avg' | 'count' = k.aggregation || 'sum';
      if (!k.aggregation && k.label.toLowerCase().includes('média')) agg = 'avg';
      return recalculateKPI(k, filteredData, k.label, k.column, agg);
    });
  }, [kpis, filteredData, activeFilters, hasActiveFilters]);

  const displayCharts = React.useMemo(() => {
    if (!hasActiveFilters || !filteredData) return charts;
    return charts.map(c => recalculateChart(c, filteredData));
  }, [charts, filteredData, activeFilters, hasActiveFilters]);

  const displayInsights = React.useMemo(() => {
    if (!hasActiveFilters || !filteredData) return insights;
    return generateLocalInsights(filteredData, displayKpis);
  }, [insights, filteredData, activeFilters, displayKpis, hasActiveFilters]);

  useEffect(() => {
    setReady(false);
    // Tiny delay so the exit animation of previous data can play
    const t = setTimeout(() => {
      setActiveFilters({});
      if (mode === 'saved') {
        setKpis(savedKpis || []);
        setCharts(savedCharts || []);
        setInsights(savedInsights || []);
      } else if (mode === 'manual') {
        setKpis([]);
        setCharts([]);
        setInsights([]);
      } else {
        const newKpis = generateKPIs(data);
        const newCharts = generateCharts(data);
        const newInsights = generateLocalInsights(data, newKpis);
        setKpis(newKpis);
        setCharts(newCharts);
        setInsights(newInsights);
      }
      setReady(true);
    }, 120);
    return () => clearTimeout(t);
  }, [data, mode, savedKpis, savedCharts, savedInsights]);

  useEffect(() => {
    if (ready && onChangeElements) {
      onChangeElements(kpis, charts, insights);
    }
  }, [kpis, charts, insights, ready]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await document.fonts.ready;
      await new Promise(res => setTimeout(res, 300));
      const dashboardEl = document.getElementById('dashboard-content');
      if (!dashboardEl) return;
      const canvas = await html2canvas(dashboardEl, {
        scale: 2,
        backgroundColor: theme.bg,
        useCORS: true,
        logging: false,
        windowWidth: 1280,
        onclone: (doc) => {
          const el = doc.getElementById('dashboard-content');
          if (el) {
            el.style.width = '1280px';
            el.style.margin = '0 auto';
            el.style.padding = '24px';
            const truncates = el.querySelectorAll('.truncate');
            truncates.forEach(t => {
              t.classList.remove('truncate');
              (t as HTMLElement).style.whiteSpace = 'normal';
              (t as HTMLElement).style.overflow = 'visible';
            });
          }
        }
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'l' : 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_relatorio.pdf`);
    } catch (error) {
      console.error('Export falhou:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {ready && (
        <motion.div
          key={data.fileName + data.activeSheet}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
          id="dashboard-content"
          style={{ padding: '8px' }}
        >
          {/* Header */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h2 className="font-headline text-2xl font-bold" style={{ color: 'var(--text)' }}>
                Visão Geral: {title}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Aba ativa: {data.activeSheet} · {data.rowCount.toLocaleString('pt-BR')} registros processados
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(v => !v)}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80 flex items-center gap-2"
                style={{
                  background: showFilters ? 'var(--primary)30' : 'var(--bg-card)',
                  border: `1px solid ${showFilters ? 'var(--primary)' : 'var(--border)'}`,
                  color: 'var(--text)'
                }}
              >
                <Filter size={14} /> Filtros {showFilters ? '(Ativo)' : ''}
              </button>
              
              <button
                onClick={() => setShowBuilder(true)}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80 flex items-center gap-2"
                style={{ background: 'var(--primary)20', color: 'var(--primary)', border: '1px solid var(--primary)40' }}
              >
                ➕ Novo Elemento
              </button>
              {onUpdateData && (
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 hover:scale-[1.02] flex items-center gap-2"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  <Edit2 size={14} /> Editar Dados
                </button>
              )}
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="px-5 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 hover:scale-[1.02] flex items-center gap-2 disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, var(--primary), var(--accent))`, color: '#fff' }}
              >
                {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                {isExporting ? 'Processando...' : 'Exportar Relatório'}
              </button>
            </div>
          </motion.div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <FilterPanel 
                  data={data} 
                  filters={activeFilters} 
                  onFilterChange={(col, val) => setActiveFilters(prev => ({ ...prev, [col]: val }))} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* KPI Grid */}
          {kpis.length > 0 && (
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp}>
              <KPIGrid 
                 kpis={displayKpis} 
                 onRemove={(id) => setKpis(prev => prev.filter(k => k.id !== id))} 
                 onEdit={(k) => setEditingKpi(k)}
              />
            </motion.div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayCharts.map((config, i) => (
              <motion.div
                key={config.id}
                custom={i + 2}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <ChartWidget config={config} colors={[theme.primary, theme.accent, theme.text, '#34D399', '#F59E0B']} onRemove={(id) => setCharts(prev => prev.filter(c => c.id !== id))} />
              </motion.div>
            ))}
            {kpis.length === 0 && charts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center py-20 text-center gap-6"
              >
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center"
                  style={{ background: 'var(--primary)15', border: '2px dashed var(--primary)40' }}
                >
                  <span className="text-4xl">🎛️</span>
                </div>
                <div>
                  <h3 className="font-headline text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                    Modo Manual Ativado
                  </h3>
                  <p className="max-w-md text-sm" style={{ color: 'var(--text-muted)' }}>
                    Sua Dashboard está vazia. Clique em <strong style={{ color: 'var(--primary)' }}>"➕ Novo Elemento"</strong> na barra acima para adicionar KPIs e Gráficos escolhendo manualmente as colunas da sua planilha.
                  </p>
                </div>
                <button
                  onClick={() => setShowBuilder(true)}
                  className="px-8 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', boxShadow: '0 8px 32px var(--primary)40' }}
                >
                  ➕ Criar Primeiro Elemento
                </button>
              </motion.div>
            )}
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <motion.div
              custom={charts.length + 3}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mt-8 pt-6 border-t"
              style={{ borderColor: 'var(--border)' }}
            >
              <InsightCards insights={displayInsights} onRegenerate={() => {}} loading={false} onRemove={(id) => setInsights(prev => prev.filter(i => i.id !== id))} />
            </motion.div>
          )}

          {/* Editor Modal */}
          <AnimatePresence>
            {showEditor && onUpdateData && (
              <DataEditorModal
                data={data}
                theme={theme}
                onClose={() => setShowEditor(false)}
                onSave={(newData) => {
                  onUpdateData(newData);
                }}
              />
            )}
          </AnimatePresence>

          {/* Builder Modal */}
          <AnimatePresence>
            {showBuilder && (
              <WidgetBuilderModal
                data={data}
                onClose={() => setShowBuilder(false)}
                onAddKPI={(k) => { setKpis(prev => [...prev, k]); setShowBuilder(false); }}
                onAddChart={(c) => { setCharts(prev => [...prev, c]); setShowBuilder(false); }}
              />
            )}
          </AnimatePresence>

          {/* KPI Editor Modal */}
          <AnimatePresence>
            {editingKpi && (
              <KPIEditorModal
                kpi={editingKpi}
                data={data}
                onClose={() => setEditingKpi(null)}
                onSave={(updatedKpi) => {
                  setKpis(prev => prev.map(k => k.id === updatedKpi.id ? updatedKpi : k));
                  setEditingKpi(null);
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
