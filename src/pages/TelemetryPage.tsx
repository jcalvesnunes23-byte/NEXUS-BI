import React from 'react';
import { Activity, Cpu, HardDrive, Zap } from 'lucide-react';
import { useSystemData } from '../hooks/useSystemData';
import { ChartWidget } from '../components/Charts';

export const TelemetryPage = () => {
  const { nodeActivities, systemEvents, telemetryMetrics, loading } = useSystemData();

  if (loading) {
    return <div className="p-8 text-[#a88cfb] flex items-center justify-center min-h-[50vh]">Carregando telemetria...</div>;
  }

  // Build the chart config using the fetched metrics
  const chartConfig = {
    id: 'telemetry_metrics_chart',
    type: 'area' as const,
    title: 'Throughput Global da Rede (TB/s)',
    description: 'Volume de dados processados em todos os nós quânticos.',
    xColumn: 'Mês',
    yColumn: 'TB/s',
    data: telemetryMetrics.map(m => ({
      label: m.month_label,
      value: m.value
    }))
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-headline text-[3.5rem] leading-[0.9] font-bold tracking-tighter text-[#f9f5fd]">Central de<br />Telemetria</h2>
        <p className="font-body text-lg text-[#a88cfb] mt-6 max-w-lg leading-relaxed">Monitoramento contínuo de performance, throughput e atividade de todos os nós da rede quântica.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: <Activity size={20} />, label: 'Uptime', value: '99.98%', color: 'text-[#bd9dff]' },
          { icon: <Cpu size={20} />, label: 'CPU Médio', value: '34%', color: 'text-[#bd9dff]' },
          { icon: <HardDrive size={20} />, label: 'I/O por Segundo', value: '2.4M', color: 'text-[#bd9dff]' },
          { icon: <Zap size={20} />, label: 'Nós Ativos', value: `${nodeActivities.filter(n => n.status === 'online').length}/${nodeActivities.length}`, color: 'text-[#bd9dff]' },
        ].map(({ icon, label, value }) => (
          <div key={label} className="bg-[#1f1f26] rounded-2xl p-6 shadow-kpi-glow">
            <div className="w-10 h-10 rounded-xl bg-[#bd9dff]/10 text-[#bd9dff] flex items-center justify-center mb-4">{icon}</div>
            <p className="font-label text-xs uppercase tracking-widest text-[#a88cfb] mb-2 font-bold">{label}</p>
            <p className="font-headline text-3xl font-bold text-[#f9f5fd]">{value}</p>
          </div>
        ))}
      </div>

      <ChartWidget config={chartConfig} colors={['#bd9dff']} />

      <div className="bg-[#131319] rounded-2xl p-8">
        <h3 className="font-headline text-2xl font-bold text-[#f9f5fd] mb-6">Log de Eventos Recentes</h3>
        <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-2">
          {systemEvents.map(log => (
            <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl bg-[#1f1f26] hover:bg-[#25252d] transition-colors">
              <span className="font-label text-[10px] text-[#48474d] tracking-widest shrink-0 mt-0.5">{log.event_time}</span>
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${log.type === 'ok' ? 'bg-[#bd9dff]' : log.type === 'warn' ? 'bg-[#f59e0b] animate-pulse' : 'bg-red-500 animate-pulse'}`} />
              <p className="font-body text-sm text-[#f9f5fd] flex-1">{log.event_description}</p>
              <span className="font-label text-[10px] text-[#a88cfb] shrink-0 uppercase tracking-widest">{log.node}</span>
            </div>
          ))}
          {systemEvents.length === 0 && (
            <div className="text-[#a88cfb] text-sm py-4">Nenhum evento registrado ainda.</div>
          )}
        </div>
      </div>
    </div>
  );
};

