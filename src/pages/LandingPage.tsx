import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import {
  Zap, Shield, BarChart3, ChevronRight, Sparkles, Box, FileSpreadsheet,
  Check, X, TrendingUp, Clock, AlertTriangle, Database, Eye, Lock,
  Activity, FolderOpen, Edit3, Download, Star, ArrowRight, Cpu
} from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
  onLogin: () => void;
  onSignUp: () => void;
}

const ANNUAL_EQUIV = 16.41;
const ANNUAL_TOTAL = 197.00;
const ANNUAL_DISCOUNT = 377.80;
const MONTHLY_PRICE = 47.90;
const DISCOUNT_PERCENT = Math.round((ANNUAL_DISCOUNT / (MONTHLY_PRICE * 12)) * 100);

export const LandingPage = ({ onEnter, onLogin, onSignUp }: LandingPageProps) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const features = [
    {
      icon: Box,
      color: 'purple',
      title: 'Cofres de Dados',
      desc: 'Organize planilhas e relatórios como um explorador de arquivos nativo. Crie pastas, mova arquivos via drag-and-drop e acesse tudo em um sistema virtual embutido no browser — sem servidor externo.'
    },
    {
      icon: Zap,
      color: 'blue',
      title: 'Motor Dinâmico',
      desc: 'Sem templates. O motor varre automaticamente colunas numéricas e categóricas, cruzando os dados e gerando dezenas de gráficos relevantes em segundos — tudo sem uma linha de configuração.'
    },
    {
      icon: Edit3,
      color: 'emerald',
      title: 'Editor In-App Real-time',
      desc: 'Identificou um erro no dado? Edite a célula direto no DataGrid interativo e veja o dashboard inteiro se reconstruir ao vivo. Sem abrir o Excel.'
    },
    {
      icon: Shield,
      color: 'rose',
      title: 'Centro de Segurança',
      desc: 'Painel dedicado para gestão de permissões, auditoria de acessos e configurações de privacidade. Visão clara de quem viu o quê e quando.'
    },
    {
      icon: Activity,
      color: 'amber',
      title: 'Telemetria & Performance',
      desc: 'Monitore a saúde da plataforma em tempo real: velocidade de processamento, uso de memória, latências e alertas automáticos de anomalias.'
    },
    {
      icon: Download,
      color: 'sky',
      title: 'Exportação em Alta Definição',
      desc: 'Gere relatórios PDF com vetores escaláveis que não quebram no zoom, fontes padronizadas e layout otimizado para impressão — com um clique.'
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    purple: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'hover:border-purple-500/60', glow: 'shadow-purple-500/20' },
    blue: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'hover:border-blue-500/60', glow: 'shadow-blue-500/20' },
    emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'hover:border-emerald-500/60', glow: 'shadow-emerald-500/20' },
    rose: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'hover:border-rose-500/60', glow: 'shadow-rose-500/20' },
    amber: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'hover:border-amber-500/60', glow: 'shadow-amber-500/20' },
    sky: { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'hover:border-sky-500/60', glow: 'shadow-sky-500/20' },
  };

  const planFeatures = [
    'Importação ilimitada de planilhas (Excel/CSV)',
    'Motor dinâmico de gráficos (sem templates)',
    'Editor In-App em tempo real',
    'Cofres de Dados com File System virtual',
    'Centro de Segurança e Auditoria',
    'Telemetria e monitoramento de performance',
    'Exportação PDF em Alta Definição',
    'Suporte prioritário via chat',
  ];

  return (
    <div className="min-h-screen text-slate-300 overflow-x-hidden" style={{ background: '#07070E', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 z-[100] origin-left"
        style={{ scaleX, background: 'linear-gradient(90deg, #7C3AED, #38BDF8)' }}
      />

      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-15%] w-[50%] h-[50%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="fixed top-[50%] right-[-10%] w-[35%] h-[60%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="fixed bottom-0 left-[30%] w-[40%] h-[30%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 border-b border-white/[0.06]"
        style={{ background: 'rgba(7,7,14,0.7)', backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tight text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>NEXUS BI</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { const el = document.getElementById('planos'); el?.scrollIntoView({ behavior: 'smooth' }); }}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-300 hover:text-white transition-colors border border-white/10 hover:border-white/20"
            >
              Planos
            </button>
            <button
              onClick={onLogin}
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white flex items-center gap-2"
            >
              Entrar <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ========== HERO ========== */}
      <section className="relative pt-44 pb-32 px-6 flex items-center justify-center overflow-hidden">

        {/* Grid background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="max-w-5xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-10"
            style={{ background: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.3)', color: '#A78BFA' }}
          >
            <Sparkles size={15} /> Inteligência de Negócios de próxima geração
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-black mb-8 leading-[1.05] tracking-tighter"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
              background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(167,139,250,0.9) 60%, rgba(56,189,248,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Seus dados.<br />Sua visão.<br />Seu controle.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl mb-14 max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#94A3B8' }}
          >
            NEXUS BI transforma planilhas comuns em dashboards cinematográficos com insights automáticos — sem programação, sem configuração, em segundos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* PRIMARY: Ver Planos */}
            <button
              onClick={() => { const el = document.getElementById('planos'); el?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group relative px-9 py-4 rounded-full font-bold text-lg text-white overflow-hidden transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', boxShadow: '0 0 40px -8px rgba(124,58,237,0.6)' }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Ver Planos <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, #6D28D9, #0EA5E9)' }} />
            </button>

            {/* SECONDARY: Teste Free */}
            <button
              onClick={onSignUp}
              className="group px-9 py-4 rounded-full font-bold text-lg border transition-all hover:scale-105 flex items-center gap-2"
              style={{ borderColor: 'rgba(167,139,250,0.4)', color: '#A78BFA', background: 'rgba(124,58,237,0.08)' }}
            >
              <Star size={18} className="group-hover:rotate-12 transition-transform" />
              Teste Free
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-10 border-t border-white/[0.06]"
          >
            {[
              { value: '< 3s', label: 'Para gerar dashboards' },
              { value: '100%', label: 'Sem servidor externo' },
              { value: '∞', label: 'Planilhas suportadas' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>{s.value}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== ANTES VS DEPOIS ========== */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#A78BFA' }}>A Transformação</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>Como era antes — e como é agora</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">O mundo das planilhas era lento, manual e cheio de erros. O NEXUS BI chegou para mudar isso.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* ANTES */}
            <motion.div variants={fadeInUp} className="rounded-3xl p-8 border" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.15)' }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <X className="text-red-400" size={20} />
                </div>
                <h3 className="text-xl font-bold text-red-400" style={{ fontFamily: "'Outfit', sans-serif" }}>Antes do NEXUS BI</h3>
              </div>
              <ul className="space-y-5">
                {[
                  { icon: Clock, text: 'Horas formatando planilhas no Excel ou Google Sheets manualmente' },
                  { icon: AlertTriangle, text: 'Gráficos quebrados ao mudar dados — reconstrução manual constante' },
                  { icon: AlertTriangle, text: 'Dados de moeda (R$) corrompidos quebravam todos os cálculos' },
                  { icon: Clock, text: 'Relatórios em PDF com layout desformatado ao imprimir' },
                  { icon: AlertTriangle, text: 'Nenhum insight automático — tudo dependia de análise humana' },
                  { icon: X, text: 'Arquivos espalhados: Downloads, Desktop, E-mail. Caos total.' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <item.icon size={18} className="text-red-400/70 mt-0.5 shrink-0" />
                    <span className="text-slate-400 leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* DEPOIS */}
            <motion.div variants={fadeInUp} className="rounded-3xl p-8 border relative overflow-hidden" style={{ background: 'rgba(124,58,237,0.07)', borderColor: 'rgba(124,58,237,0.25)' }}>
              <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)' }} />
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(56,189,248,0.3))' }}>
                  <Sparkles className="text-purple-300" size={20} />
                </div>
                <h3 className="text-xl font-bold text-purple-300" style={{ fontFamily: "'Outfit', sans-serif" }}>Com NEXUS BI</h3>
              </div>
              <ul className="space-y-5 relative z-10">
                {[
                  { icon: Zap, text: 'Dashboard completo em menos de 3 segundos — arrasta a planilha e pronto' },
                  { icon: TrendingUp, text: 'Gráficos se recalculam automaticamente ao editar qualquer dado' },
                  { icon: Check, text: 'IA higieniza automaticamente valores em R$ e datas corrompidas' },
                  { icon: Download, text: 'PDF com layout vetorial perfeito, fontes padronizadas e sem distorções' },
                  { icon: Eye, text: 'Insights automáticos de tendências, maiores valores e variações' },
                  { icon: FolderOpen, text: 'Cofres de dados organizados: tudo no lugar, acessível em um clique' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <item.icon size={18} className="text-purple-400 mt-0.5 shrink-0" />
                    <span className="text-slate-300 leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== FUNCIONALIDADES ========== */}
      <section id="features" className="py-32 px-6 relative" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#A78BFA' }}>O que está incluso</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>Tudo que você precisa.<br />Nada que você não quer.</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Cada funcionalidade foi projetada para eliminar fricção e entregar resultado imediato.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feat) => {
              const cm = colorMap[feat.color];
              return (
                <motion.div
                  key={feat.title}
                  variants={fadeInUp}
                  className={`p-7 rounded-3xl border border-white/[0.07] ${cm.border} transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:${cm.glow}`}
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className={`w-13 h-13 rounded-2xl ${cm.bg} ${cm.text} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`} style={{ width: 52, height: 52 }}>
                    <feat.icon size={24} />
                  </div>
                  <h3 className={`text-xl font-bold text-white mb-3 ${cm.text.replace('text-', 'group-hover:text-')}`} style={{ fontFamily: "'Outfit', sans-serif" }}>{feat.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{feat.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ========== WORKFLOW ========== */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            <motion.div variants={fadeInUp} className="flex-1">
              <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#A78BFA' }}>Como funciona</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Zero Configuração.<br /><span style={{ color: '#A78BFA' }}>Poder Absoluto.</span>
              </h2>
              <ul className="space-y-8 mt-10">
                {[
                  { n: '01', color: '#7C3AED', title: 'Importação Instantânea', desc: 'Arraste qualquer Excel/CSV. O motor lê e processa os dados em segundos.' },
                  { n: '02', color: '#38BDF8', title: 'Higienização por IA', desc: 'R$, datas corrompidas e inconsistências são limpas e convertidas automaticamente para cálculos reais.' },
                  { n: '03', color: '#10B981', title: 'Dashboard em Segundos', desc: 'Gráficos gerados automaticamente, KPIs calculados, insights detectados — sem uma linha de código.' },
                ].map((step) => (
                  <li key={step.n} className="flex gap-5 items-start">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white shrink-0 text-sm" style={{ background: `${step.color}25`, border: `1px solid ${step.color}40`, color: step.color, fontFamily: "'Outfit', sans-serif" }}>
                      {step.n}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1.5" style={{ fontFamily: "'Outfit', sans-serif" }}>{step.title}</h4>
                      <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex-1 w-full">
              {/* Fake Dashboard UI */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10" style={{ background: '#0A0A0F', boxShadow: '0 40px 100px -20px rgba(124,58,237,0.3)', aspectRatio: '4/3' }}>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(56,189,248,0.03) 100%)' }} />
                {/* Fake nav bar */}
                <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="ml-4 flex-1 rounded-full h-5" style={{ background: 'rgba(255,255,255,0.05)', maxWidth: '200px' }} />
                </div>
                {/* Content simulation */}
                <div className="p-5 flex flex-col gap-4 h-full">
                  <div className="grid grid-cols-3 gap-3">
                    {['#7C3AED', '#38BDF8', '#10B981'].map((c, i) => (
                      <div key={i} className="h-16 rounded-xl flex flex-col justify-center px-4" style={{ background: `${c}18`, border: `1px solid ${c}30` }}>
                        <div className="h-2 rounded w-12 mb-2" style={{ background: `${c}60` }} />
                        <div className="h-3 rounded w-8" style={{ background: `${c}90` }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 flex-1">
                    <div className="flex-1 rounded-xl overflow-hidden flex items-end gap-1 px-4 pb-4" style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.15)' }}>
                      {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: `linear-gradient(180deg, #7C3AED, #A78BFA)`, opacity: 0.7 + i * 0.03 }} />
                      ))}
                    </div>
                    <div className="w-1/3 rounded-xl flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.15)' }}>
                      <div className="w-20 h-20 rounded-full border-4 border-sky-400/30 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-400 animate-spin" style={{ animationDuration: '3s' }} />
                        <Cpu size={20} className="text-sky-400/70" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== PLANOS ========== */}
      <section id="planos" className="py-32 px-6 relative" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#A78BFA' }}>Planos e preços</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>Simples e transparente.<br />Sem surpresas.</h2>

            {/* Toggle */}
            <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl mt-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => setBillingCycle('monthly')}
                className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
                style={billingCycle === 'monthly' ? { background: 'rgba(124,58,237,0.4)', color: '#fff', boxShadow: '0 0 20px rgba(124,58,237,0.3)' } : { color: '#94A3B8' }}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className="px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                style={billingCycle === 'annual' ? { background: 'rgba(124,58,237,0.4)', color: '#fff', boxShadow: '0 0 20px rgba(124,58,237,0.3)' } : { color: '#94A3B8' }}
              >
                Anual <span className="text-xs py-0.5 px-2 rounded-full font-black" style={{ background: 'rgba(16,185,129,0.2)', color: '#10B981' }}>-{DISCOUNT_PERCENT}%</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Plano Mensal */}
            <motion.div
              variants={fadeInUp}
              className="rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="mb-7">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Plano Mensal</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    R$ {MONTHLY_PRICE.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-slate-500 mb-2">/mês</span>
                </div>
                <p className="text-slate-500 text-sm mt-2">Cancele quando quiser</p>
              </div>
              <ul className="space-y-3 mb-9">
                {planFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    <span className="text-slate-400 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onSignUp}
                className="w-full py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.02] border border-white/15 hover:border-white/25"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}
              >
                Começar Agora
              </button>
            </motion.div>

            {/* Plano Anual — DESTAQUE */}
            <motion.div
              variants={fadeInUp}
              className="rounded-3xl p-8 relative overflow-hidden border transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.2), rgba(56,189,248,0.1))', borderColor: 'rgba(124,58,237,0.5)', boxShadow: '0 0 60px -15px rgba(124,58,237,0.4)' }}
            >
              {/* Badge popular */}
              <div className="absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-black" style={{ background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', color: '#fff' }}>
                ⭐ MAIS POPULAR
              </div>

              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)' }} />

              <div className="mb-7 relative z-10">
                <p className="text-sm font-bold text-purple-300 uppercase tracking-widest mb-3">Plano Anual</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    R$ {ANNUAL_EQUIV.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-slate-400 mb-2">/mês</span>
                </div>
                <p className="text-sm mt-2" style={{ color: '#A78BFA' }}>
                  Faturado anualmente por <strong>R$ {ANNUAL_TOTAL.toFixed(2).replace('.', ',')}</strong>
                  <br/>
                  <span className="text-emerald-400 font-bold inline-block mt-1">
                    Economia de R$ {ANNUAL_DISCOUNT.toFixed(2).replace('.', ',')}!
                  </span>
                </p>
              </div>

              <ul className="space-y-3 mb-9 relative z-10">
                {planFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={16} className="text-purple-400 mt-0.5 shrink-0" />
                    <span className="text-slate-200 text-sm">{f}</span>
                  </li>
                ))}
                <li className="flex items-start gap-3">
                  <Star size={16} className="text-amber-400 mt-0.5 shrink-0" />
                  <span className="text-amber-300 text-sm font-semibold">Acesso a novas funcionalidades antecipadas</span>
                </li>
              </ul>

              {/* BOTÃO CHAMATIVO */}
              <button
                onClick={onSignUp}
                className="group w-full py-4 rounded-2xl font-black text-base relative overflow-hidden transition-all hover:scale-[1.03]"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', color: '#fff', boxShadow: '0 0 40px -5px rgba(124,58,237,0.7)' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  🚀 Comprar Agora
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, #6D28D9, #0284C7)' }}
                />
              </button>
            </motion.div>
          </motion.div>

          {/* Garantia */}
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center text-slate-500 text-sm mt-10 flex items-center justify-center gap-2"
          >
            <Shield size={15} className="text-emerald-500" />
            7 dias de garantia — reembolso total sem perguntas
          </motion.p>
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section className="py-40 px-6 relative text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)', filter: 'blur(30px)' }} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto relative z-10"
        >
          <h2 className="font-black text-white mb-8 leading-[1.1]"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              background: 'linear-gradient(180deg, #ffffff 0%, rgba(167,139,250,0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Pare de construir dashboards manualmente.<br />Deixe o NEXUS trabalhar por você.
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">Junte-se à nova geração de analistas que já abandonaram o Excel para sempre.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onSignUp}
              className="group relative px-10 py-5 rounded-full font-black text-xl text-white overflow-hidden transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', boxShadow: '0 0 60px -10px rgba(124,58,237,0.7)' }}
            >
              <span className="relative z-10 flex items-center gap-2">
                🚀 Começar Grátis <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={() => { const el = document.getElementById('planos'); el?.scrollIntoView({ behavior: 'smooth' }); }}
              className="px-10 py-5 rounded-full font-bold text-lg border border-white/15 text-slate-300 hover:text-white hover:border-white/30 transition-all"
            >
              Ver Planos
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center border-t border-white/[0.06]">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #38BDF8)' }}>
            <BarChart3 size={14} className="text-white" />
          </div>
          <span className="font-black text-white text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>NEXUS BI</span>
        </div>
        <p className="text-slate-600 text-sm">© 2026 NEXUS Inteligência Artificial. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};
