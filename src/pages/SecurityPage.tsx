import React from 'react';
import { Shield, CheckCircle, AlertTriangle, Wifi } from 'lucide-react';
import { useSystemData } from '../hooks/useSystemData';

export const SecurityPage = () => {
  const { securityProtocols, nodeActivities, loading } = useSystemData();

  const activeProtocols = securityProtocols.filter(p => p.status === 'Ativo').length;
  
  if (loading) {
    return <div className="p-8 text-[#a88cfb] flex items-center justify-center min-h-[50vh]">Carregando integrações...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-headline text-[3.5rem] leading-[0.9] font-bold tracking-tighter text-[#f9f5fd]">Protocolos de<br />Segurança</h2>
        <p className="font-body text-lg text-[#a88cfb] mt-6 max-w-lg leading-relaxed">Status em tempo real de todas as camadas de proteção e conformidade dos nós globais.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Protocolos Ativos', value: `${activeProtocols}/${securityProtocols.length || 6}`, sub: 'Monitoramento contínuo', up: true },
          { label: 'Nível de Ameaça', value: 'BAIXO', sub: '0 incidentes hoje', up: true },
          { label: 'Cert. SSL Expira', value: '89d', sub: 'Renovação automática', up: true },
        ].map(({ label, value, sub, up }) => (
          <div key={label} className="bg-[#1f1f26] rounded-2xl p-8 shadow-kpi-glow">
            <p className="font-label text-xs uppercase tracking-[0.2em] text-[#a88cfb] mb-4 font-bold">{label}</p>
            <p className="font-headline text-4xl font-bold text-[#f9f5fd] mb-2">{value}</p>
            <p className={`font-label text-xs font-bold ${up ? 'text-[#bd9dff]' : 'text-[#f59e0b]'}`}>{sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#131319] rounded-2xl p-8">
        <h3 className="font-headline text-2xl font-bold text-[#f9f5fd] mb-8">Camadas de Proteção</h3>
        <div className="space-y-4">
          {securityProtocols.map(p => (
            <div key={p.id} className="flex items-center gap-6 p-5 rounded-xl hover:bg-[#1f1f26] transition-colors group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${p.status === 'Ativo' ? 'bg-[#bd9dff]/10 text-[#bd9dff]' : 'bg-[#f59e0b]/10 text-[#f59e0b]'}`}>
                {p.status === 'Ativo' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-body text-sm font-bold text-[#f9f5fd]">{p.name}</p>
                  <span className={`font-label text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-widest ${p.status === 'Ativo' ? 'bg-[#bd9dff]/10 text-[#bd9dff]' : 'bg-[#f59e0b]/10 text-[#f59e0b]'}`}>{p.status}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-[#0e0e13] rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${p.status === 'Ativo' ? 'bg-gradient-to-r from-[#8a4cfc] to-[#bd9dff]' : 'bg-[#f59e0b]'}`}
                      style={{ width: `${p.strength}%` }}
                    />
                  </div>
                  <span className="font-label text-[10px] text-[#a88cfb] shrink-0">{p.strength}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#131319] rounded-2xl p-8">
        <h3 className="font-headline text-2xl font-bold text-[#f9f5fd] mb-8">Status dos Nós Globais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {nodeActivities.map(n => (
            <div key={n.id} className="bg-[#1f1f26] rounded-xl p-5 hover:bg-[#25252d] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Wifi size={16} className={n.status === 'online' ? 'text-[#bd9dff]' : 'text-[#f59e0b]'} />
                  <span className="font-body text-sm font-bold text-[#f9f5fd]">{n.node}</span>
                </div>
                <span className={`w-2 h-2 rounded-full ${n.status === 'online' ? 'bg-[#bd9dff] shadow-[0_0_6px_#bd9dff]' : 'bg-[#f59e0b] animate-pulse'}`} />
              </div>
              <div className="flex justify-between text-xs font-label text-[#a88cfb]">
                <span>Latência: <strong className="text-[#f9f5fd]">{n.latency}ms</strong></span>
                <span>Carga: <strong className={n.load > 85 ? 'text-[#f59e0b]' : 'text-[#f9f5fd]'}>{n.load}%</strong></span>
              </div>
              <div className="mt-3 w-full bg-[#0e0e13] rounded-full h-1">
                <div
                  className={`h-1 rounded-full ${n.load > 85 ? 'bg-[#f59e0b]' : 'bg-gradient-to-r from-[#8a4cfc] to-[#bd9dff]'}`}
                  style={{ width: `${n.load}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

