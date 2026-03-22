import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3, Mail, Lock, User, Eye, EyeOff, ArrowLeft, ArrowRight,
  Check, Sparkles, TrendingUp, Shield, Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SignUpPageProps {
  onSignUp: () => void;
  onGoToLogin: () => void;
  onBack: () => void;
}

const STEPS = ['Conta', 'Acesso', 'Pronto!'] as const;

export const SignUpPage = ({ onSignUp, onGoToLogin, onBack }: SignUpPageProps) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 1) {
      setStep(s => s + 1);
      return;
    }
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error) throw error;

      setLoading(false);
      setStep(2);
      await new Promise(r => setTimeout(r, 1200));
      localStorage.setItem('nexus_auth', 'true');
      onSignUp();
    } catch (error: any) {
      alert(error.message || "Erro ao criar conta.");
      setLoading(false);
    }
  };

  const features = [
    { icon: TrendingUp, text: 'Dashboards em segundos' },
    { icon: Shield, text: 'Dados 100% locais e seguros' },
    { icon: Zap, text: 'Motor de análise automático' },
    { icon: Sparkles, text: 'Insights inteligentes instantâneos' },
  ];

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ background: '#07070E', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ====== LEFT PANEL — Visual ====== */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #0D0518 0%, #07070E 100%)' }}>

        {/* Aurora blobs */}
        <div className="absolute pointer-events-none" style={{ top: '-10%', left: '-10%', width: '70%', height: '70%', borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%', background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 65%)', animation: 'morphGlow 10s ease-in-out infinite, aurora 18s linear infinite', filter: 'blur(30px)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '5%', right: '-15%', width: '60%', height: '60%', borderRadius: '40% 60% 30% 70% / 60% 40% 70% 30%', background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 65%)', animation: 'morphGlow 14s ease-in-out infinite reverse, aurora 22s linear infinite', filter: 'blur(40px)' }} />
        <div className="absolute pointer-events-none" style={{ top: '40%', left: '30%', width: '40%', height: '40%', borderRadius: '70% 30% 40% 60% / 30% 70% 60% 40%', background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 65%)', animation: 'morphGlow 8s ease-in-out infinite, aurora 10s linear infinite reverse', filter: 'blur(20px)' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{
          backgroundImage: 'linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <span className="text-2xl font-black tracking-tight text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>NEXUS BI</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-4xl font-black text-white mb-6 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Comece sua jornada de{' '}
              <span style={{ background: 'linear-gradient(135deg, #A78BFA, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                inteligência.
              </span>
            </h2>
            <p className="text-slate-400 text-base mb-10 leading-relaxed">Junte-se a quem já transformou planilhas sem sentido em decisões estratégicas poderosas.</p>

            <div className="space-y-4">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}>
                    <f.icon size={16} className="text-purple-400" />
                  </div>
                  <span className="text-slate-300 text-sm font-medium">{f.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Fake mini dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 rounded-2xl p-5 border relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(124,58,237,0.2)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-500">Dashboard ao vivo</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {['#7C3AED', '#38BDF8', '#10B981'].map((c, i) => (
                <div key={i} className="h-10 rounded-lg flex items-end px-2 pb-2" style={{ background: `${c}15`, border: `1px solid ${c}25` }}>
                  <div className="h-1.5 rounded-full w-full" style={{ background: `${c}60`, width: `${[70, 90, 55][i]}%` }} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 h-16">
              <div className="flex-1 rounded-lg flex items-end gap-0.5 px-2 pb-2" style={{ background: 'rgba(124,58,237,0.08)' }}>
                {[35, 55, 45, 75, 60, 85, 70].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: 'linear-gradient(0deg, #7C3AED, #A78BFA)', opacity: 0.7 }} />
                ))}
              </div>
              <div className="w-16 rounded-lg flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.08)' }}>
                <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: 'rgba(56,189,248,0.4)' }}>
                  <TrendingUp size={12} className="text-sky-400" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer of left panel */}
        <div className="relative z-10">
          <p className="text-slate-600 text-xs">7 dias de teste gratuito · Sem cartão</p>
        </div>
      </div>

      {/* ====== RIGHT PANEL — Form ====== */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-8">

        {/* background for mobile */}
        <div className="lg:hidden absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'radial-gradient(ellipse at top left, rgba(124,58,237,0.1) 0%, transparent 60%)' }} />
        </div>

        {/* Back button */}
        <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium z-20">
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="w-full max-w-[420px] relative z-10">

          {/* Step indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-10"
          >
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500"
                    style={{
                      background: i < step ? 'linear-gradient(135deg, #7C3AED, #38BDF8)' : i === step ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)',
                      border: i === step ? '2px solid #7C3AED' : '2px solid transparent',
                      color: i <= step ? '#fff' : '#475569'
                    }}
                  >
                    {i < step ? <Check size={12} /> : i + 1}
                  </div>
                  <span className="text-xs font-semibold hidden sm:block" style={{ color: i === step ? '#A78BFA' : '#475569' }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 rounded-full transition-all duration-500" style={{ background: i < step ? 'linear-gradient(90deg, #7C3AED, #38BDF8)' : 'rgba(255,255,255,0.07)' }} />
                )}
              </React.Fragment>
            ))}
          </motion.div>

          {/* Logo (mobile only) */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="text-xl font-black tracking-tight text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>NEXUS BI</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Criar sua conta</h2>
                <p className="text-slate-500 text-sm mb-8">7 dias grátis · Sem cartão de crédito</p>

                <form onSubmit={handleNext} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nome completo</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Seu nome"
                        className="auth-input w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm placeholder:text-slate-600"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">E-mail</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="auth-input w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm placeholder:text-slate-600"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="group w-full py-4 rounded-xl font-bold text-base text-white mt-2 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', boxShadow: '0 0 30px -5px rgba(124,58,237,0.5)' }}
                  >
                    Continuar <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Defina sua senha</h2>
                <p className="text-slate-500 text-sm mb-8">Olá, <span className="text-slate-300 font-semibold">{name}</span>! Quase lá 🎉</p>

                <form onSubmit={handleNext} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Criar senha</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className="auth-input w-full pl-11 pr-12 py-3.5 rounded-xl text-white text-sm placeholder:text-slate-600"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        required minLength={6}
                      />
                      <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Password strength indicator */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full transition-all duration-500"
                        style={{
                          background: password.length >= i * 2
                            ? i <= 1 ? '#EF4444' : i <= 2 ? '#F59E0B' : i <= 3 ? '#3B82F6' : '#10B981'
                            : 'rgba(255,255,255,0.08)'
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    {password.length === 0 ? 'Digite uma senha forte' : password.length < 4 ? 'Muito fraca' : password.length < 6 ? 'Fraca' : password.length < 8 ? 'Boa' : '✓ Forte'}
                  </p>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="flex-1 py-4 rounded-xl font-bold text-sm border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex-[2] py-4 rounded-xl font-bold text-base text-white transition-all hover:scale-[1.02] flex items-center justify-center gap-2 relative overflow-hidden"
                      style={{ background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7C3AED, #38BDF8)', boxShadow: loading ? 'none' : '0 0 30px -5px rgba(124,58,237,0.5)' }}
                    >
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Criando conta...
                          </motion.div>
                        ) : (
                          <motion.span key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            Criar Conta <Sparkles size={16} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', boxShadow: '0 0 40px rgba(124,58,237,0.6)' }}
                >
                  <Check size={36} className="text-white" strokeWidth={3} />
                </motion.div>
                <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>Conta criada! 🎉</h2>
                <p className="text-slate-400">Entrando no NEXUS BI...</p>
                <div className="mt-6 flex justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                Já tem uma conta?{' '}
                <button onClick={onGoToLogin} className="font-bold transition-colors hover:text-white" style={{ color: '#A78BFA' }}>
                  Entrar
                </button>
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
