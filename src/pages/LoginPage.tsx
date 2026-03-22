import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, Mail, Lock, Eye, EyeOff, ChevronRight, ArrowLeft, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
  onLogin: () => void;
  onGoToSignUp: () => void;
  onBack: () => void;
}

export const LoginPage = ({ onLogin, onGoToSignUp, onBack }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      localStorage.setItem('nexus_auth', 'true');
      // Não chamamos onLogin() aqui — o onAuthStateChange no App.tsx já
      // detecta o login e muda a view para 'app' automaticamente.
      // setLoading permanece true até a navegação acontecer.
    } catch (error: any) {
      alert(error.message || 'E-mail ou senha incorretos.');
      setLoading(false);
    }
  };

  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 4,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative" style={{ background: '#07070E', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ====== ANIMATED BACKGROUND ====== */}

      {/* Deep glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)', animation: 'aurora 15s linear infinite' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 65%)', animation: 'aurora 20s linear infinite reverse' }} />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(167,139,250,1), transparent)',
          animation: 'scanline 5s linear infinite'
        }} />
      </div>

      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? 'rgba(124,58,237,0.7)' : p.id % 3 === 1 ? 'rgba(167,139,250,0.5)' : 'rgba(56,189,248,0.4)',
            animation: `particleDrift ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 3}px currentColor`,
          }}
        />
      ))}

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium z-20"
      >
        <ArrowLeft size={16} /> Voltar
      </button>

      {/* ====== CARD ====== */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="gradient-border relative z-10 w-full mx-4"
        style={{ maxWidth: '440px' }}
      >
        <div className="p-10" style={{ background: 'rgba(8,8,18,0.92)', backdropFilter: 'blur(40px)', borderRadius: '24px' }}>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center mb-10"
          >
            <div className="flex flex-col items-center gap-3">
              <div>
                <h1 className="text-3xl font-black text-white text-center animate-text-glow tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>NEXUS BI</h1>
                <p className="text-xs text-slate-500 text-center tracking-widest mt-1">INTELIGÊNCIA DE NEGÓCIOS</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Bem-vindo de volta</h2>
            <p className="text-slate-500 text-sm mb-8">Entre na sua conta para acessar seus dashboards</p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">E-mail</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="auth-input w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm placeholder:text-slate-600 transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Senha</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="auth-input w-full pl-11 pr-12 py-3.5 rounded-xl text-white text-sm placeholder:text-slate-600 transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8"
            >
              <button
                type="submit"
                disabled={loading}
                className="group w-full py-4 rounded-xl font-bold text-base text-white transition-all hover:scale-[1.02] relative overflow-hidden"
                style={{
                  background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7C3AED, #38BDF8)',
                  boxShadow: loading ? 'none' : '0 0 30px -5px rgba(124,58,237,0.6)'
                }}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Autenticando...</span>
                    </motion.div>
                  ) : (
                    <motion.span key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                      Entrar <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-slate-500 text-sm">
              Não tem uma conta?{' '}
              <button onClick={onGoToSignUp} className="font-bold transition-colors hover:text-white" style={{ color: '#A78BFA' }}>
                Criar conta grátis
              </button>
            </p>
          </motion.div>


        </div>
      </motion.div>
    </div>
  );
};
