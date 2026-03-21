import React from 'react';
import {
  LayoutDashboard,
  Database,
  Shield,
  Activity,
  Search,
  Bell,
  ChevronRight,
  UploadCloud,
  Zap,
  Lock
} from 'lucide-react';

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <a href="#" className={`flex items-center gap-4 px-8 py-4 transition-all duration-300 relative group ${active ? 'text-[#bd9dff] bg-[#131319]/50' : 'text-[#a88cfb] hover:text-[#f9f5fd] hover:bg-[#131319]'}`}>
    {active && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#bd9dff] shadow-[0_0_12px_#bd9dff]" />}
    <div className={`${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'} transition-opacity`}>
      {icon}
    </div>
    <span className="font-body text-sm font-bold tracking-wide">{label}</span>
  </a>
);

const Button = ({ children, variant = 'primary', className = '' }: { children: React.ReactNode, variant?: 'primary' | 'secondary', className?: string }) => {
  const baseStyle = "px-8 py-3.5 rounded-md font-label text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer";
  const variants = {
    primary: "bg-gradient-to-r from-[#bd9dff] to-[#8a4cfc] text-[#3c0089] hover:shadow-[0_0_24px_rgba(189,157,255,0.4)] hover:scale-[1.02]",
    secondary: "bg-transparent border border-ghost text-[#bd9dff] hover:border-[#bd9dff]/50 hover:bg-[#bd9dff]/5"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ placeholder, icon }: { placeholder: string, icon?: React.ReactNode }) => (
  <div className="relative group w-72">
    {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a88cfb] group-focus-within:text-[#bd9dff] transition-colors">{icon}</div>}
    <input
      type="text"
      placeholder={placeholder}
      className={`w-full bg-[#000000] border border-ghost rounded-md py-3.5 ${icon ? 'pl-12' : 'pl-5'} pr-5 font-label text-sm text-[#f9f5fd] placeholder:text-[#48474d] focus:outline-none focus:border-[#bd9dff] focus:shadow-[0_0_16px_rgba(189,157,255,0.2)] transition-all duration-300`}
    />
  </div>
);

const KPICard = ({ title, value, unit, trend, trendUp }: { title: string, value: string, unit: string, trend: string, trendUp: boolean }) => (
  <div className="bg-[#1f1f26] rounded-2xl p-10 shadow-kpi-glow relative overflow-hidden group">
    <div className="absolute -inset-4 bg-gradient-to-br from-[#bd9dff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl pointer-events-none" />
    <div className="relative z-10">
      <h3 className="font-label text-xs uppercase tracking-[0.2em] text-[#a88cfb] mb-8 font-bold">{title}</h3>
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <p className="font-headline text-[4rem] leading-none font-bold text-[#f9f5fd] tracking-tighter">{value}</p>
          {unit && <span className="font-headline text-2xl font-bold text-[#a88cfb]">{unit}</span>}
        </div>
        <div className={`flex items-center gap-1.5 font-label text-xs font-bold mb-2 px-3 py-1.5 rounded-md ${trendUp ? 'bg-[#bd9dff]/10 text-[#bd9dff]' : 'bg-[#48474d]/20 text-[#a88cfb]'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      </div>
    </div>
  </div>
);

const DataRow = ({ id, name, status, date, size }: { id: string, name: string, status: string, date: string, size: string }) => (
  <div className="flex items-center justify-between py-5 px-6 rounded-xl hover:bg-[#1f1f26] transition-all duration-300 group cursor-pointer">
    <div className="flex items-center gap-5 w-2/5">
      <div className="w-12 h-12 rounded-xl bg-[#000000] flex items-center justify-center text-[#bd9dff] group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(189,157,255,0.15)] transition-all duration-300">
        <Database size={20} strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-body text-base font-bold text-[#f9f5fd]">{name}</p>
        <p className="font-label text-xs text-[#a88cfb] mt-1.5 tracking-widest uppercase">{id}</p>
      </div>
    </div>
    <div className="w-1/5">
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-label text-[10px] font-bold uppercase tracking-widest ${
        status === 'Criptografado' ? 'bg-[#bd9dff]/10 text-[#bd9dff]' : 
        status === 'Processando' ? 'bg-[#8a4cfc]/10 text-[#8a4cfc]' : 
        'bg-[#000000] text-[#a88cfb]'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          status === 'Criptografado' ? 'bg-[#bd9dff] shadow-[0_0_8px_#bd9dff]' : 
          status === 'Processando' ? 'bg-[#8a4cfc] animate-pulse' : 
          'bg-[#48474d]'
        }`}></span>
        {status}
      </span>
    </div>
    <div className="w-1/5 font-label text-sm text-[#a88cfb] font-medium">{date}</div>
    <div className="w-1/5 text-right font-label text-sm text-[#f9f5fd] font-bold">{size}</div>
    <div className="w-12 flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0">
      <div className="w-8 h-8 rounded-full bg-[#25252d] flex items-center justify-center text-[#bd9dff]">
        <ChevronRight size={16} strokeWidth={2} />
      </div>
    </div>
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen bg-[#0e0e13] text-[#f9f5fd] flex selection:bg-[#bd9dff]/30 selection:text-[#bd9dff] overflow-hidden font-body">
      
      {/* Sidebar - Glassmorphism */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-[#0e0e13]/60 backdrop-blur-[40px] z-40 flex flex-col shadow-[4px_0_32px_rgba(0,0,0,0.6)]">
        <div className="p-10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#bd9dff] to-[#8a4cfc] flex items-center justify-center shadow-[0_0_20px_rgba(189,157,255,0.3)]">
              <Zap size={20} className="text-[#3c0089]" fill="currentColor" />
            </div>
            <div>
              <h1 className="font-headline text-2xl font-bold text-[#f9f5fd] tracking-tight leading-none">Obsidian</h1>
              <p className="font-label text-[9px] text-[#bd9dff] mt-1.5 tracking-[0.3em] uppercase font-bold">Sistema de Arquivos</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 mt-8 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Centro de Comando" active />
          <NavItem icon={<Database size={20} />} label="Cofres de Dados" />
          <NavItem icon={<Shield size={20} />} label="Protocolos de Segurança" />
          <NavItem icon={<Activity size={20} />} label="Telemetria" />
        </nav>
        
        <div className="p-8 mb-4">
          <div className="bg-[#131319] rounded-xl p-4 flex items-center gap-4 hover:bg-[#1f1f26] transition-colors cursor-pointer">
            {/* Direct Image Link from Unsplash */}
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="Dra. E. Vance" 
              className="w-10 h-10 rounded-full object-cover border border-ghost" 
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="font-body text-sm font-bold text-[#f9f5fd]">Dra. E. Vance</p>
              <p className="font-label text-[10px] text-[#a88cfb] tracking-widest uppercase mt-1 font-semibold">Acesso Nível 5</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 ml-72 relative h-screen overflow-y-auto custom-scrollbar">
        {/* Ambient background light */}
        <div className="absolute top-[-20%] left-[10%] w-[1000px] h-[800px] bg-[#bd9dff]/[0.02] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#8a4cfc]/[0.03] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-[1600px] mx-auto p-12 lg:p-16">
          {/* Header */}
          <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 mb-20">
            <div>
              <h2 className="font-headline text-[4.5rem] leading-[0.9] font-bold tracking-tighter text-[#f9f5fd]">Visão Geral<br/>do Sistema</h2>
              <p className="font-body text-lg text-[#a88cfb] mt-8 max-w-lg leading-relaxed">Métricas em tempo real e status dos cofres. Monitoramento de telemetria quântica e arquivos criptografados em todos os nós globais.</p>
            </div>
            <div className="flex items-center gap-6">
              <Input placeholder="Buscar arquivos..." icon={<Search size={18} />} />
              <button className="w-[52px] h-[52px] rounded-md bg-[#000000] flex items-center justify-center text-[#a88cfb] hover:text-[#bd9dff] hover:bg-[#131319] transition-all relative group border border-ghost cursor-pointer">
                <Bell size={20} />
                <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-[#bd9dff] rounded-full shadow-[0_0_8px_#bd9dff] group-hover:animate-ping"></span>
              </button>
              <Button>Gerar Relatório</Button>
            </div>
          </header>
          
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <KPICard title="Tamanho Total do Cofre" value="24.8" unit="TB" trend="12.4%" trendUp={true} />
            <KPICard title="Nós Ativos" value="1.402" unit="" trend="3.1%" trendUp={true} />
            <KPICard title="Anomalias" value="0" unit="" trend="0.0%" trendUp={false} />
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Data List */}
            <div className="xl:col-span-2 bg-[#131319] rounded-2xl p-10 shadow-ambient flex flex-col">
              <div className="flex items-center justify-between mb-10">
                <h3 className="font-headline text-3xl font-bold text-[#f9f5fd] tracking-tight">Arquivos Recentes</h3>
                <Button variant="secondary" className="py-2.5 px-6 text-xs">Ver Todos</Button>
              </div>
              
              <div className="flex-1 flex flex-col gap-2">
                <DataRow id="ARC-2023-001" name="Dados de Telemetria Quântica" status="Criptografado" date="24 Out, 2023" size="4.2 TB" />
                <DataRow id="ARC-2023-002" name="Logs Comportamentais de Usuários" status="Processando" date="23 Out, 2023" size="850 GB" />
                <DataRow id="ARC-2023-003" name="Livro-razão Financeiro Q3" status="Criptografado" date="21 Out, 2023" size="1.1 TB" />
                <DataRow id="ARC-2023-004" name="Backups de Sistema Alpha" status="Criptografado" date="20 Out, 2023" size="12.5 TB" />
                <DataRow id="ARC-2023-005" name="Pesos de Rede Neural" status="Arquivado" date="18 Out, 2023" size="8.9 TB" />
              </div>
            </div>

            {/* Upload Panel */}
            <div className="bg-[#1f1f26] rounded-2xl p-10 shadow-kpi-glow flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#bd9dff]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="font-headline text-2xl font-bold text-[#f9f5fd] tracking-tight mb-2">Upload Seguro</h3>
              <p className="font-body text-sm text-[#a88cfb] mb-8">Inicialize o protocolo de criptografia quântica para novos conjuntos de dados.</p>
              
              <div className="flex-1 border-2 border-dashed border-ghost rounded-xl flex flex-col items-center justify-center p-8 text-center hover:border-[#bd9dff]/50 hover:bg-[#bd9dff]/5 transition-all duration-300 cursor-pointer group mb-8">
                <div className="w-16 h-16 rounded-full bg-[#000000] flex items-center justify-center text-[#a88cfb] group-hover:text-[#bd9dff] group-hover:scale-110 transition-all duration-300 mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <UploadCloud size={28} />
                </div>
                <p className="font-body text-base font-bold text-[#f9f5fd] mb-2">Arraste e Solte Arquivos</p>
                <p className="font-label text-xs text-[#a88cfb]">ou clique para procurar nos nós locais</p>
              </div>
              
              <div className="bg-[#000000] rounded-xl p-5 flex items-start gap-4 border border-ghost">
                <Lock size={18} className="text-[#bd9dff] shrink-0 mt-0.5" />
                <div>
                  <p className="font-label text-xs font-bold text-[#f9f5fd] mb-1">Criptografia AES-256 Ativa</p>
                  <p className="font-label text-[10px] text-[#a88cfb] leading-relaxed">Todos os arquivos são criptografados automaticamente antes de saírem do ambiente local.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
