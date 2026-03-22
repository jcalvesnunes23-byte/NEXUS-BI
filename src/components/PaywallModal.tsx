import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, Star, ArrowRight, Check, Zap, Shield, X } from 'lucide-react';

interface PaywallProps {
  onClose?: () => void;
  onChoosePlan: (plan: 'monthly' | 'annual') => void;
}

const ANNUAL_EQUIV = 16.41;
const ANNUAL_TOTAL = 197.00;
const ANNUAL_DISCOUNT = 377.80;
const MONTHLY_PRICE = 47.90;
const DISCOUNT_PERCENT = Math.round((ANNUAL_DISCOUNT / (MONTHLY_PRICE * 12)) * 100);

const planFeatures = [
  'Importações ilimitadas de planilhas',
  'Motor dinâmico de gráficos automáticos',
  'Editor In-App em tempo real',
  'Cofres de Dados com File System virtual',
  'Exportação PDF em Alta Definição',
  'Suporte prioritário via chat',
];

export const PaywallModal = ({ onClose, onChoosePlan }: PaywallProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
        onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
      >
        <motion.div
           initial={{ opacity: 0, scale: 0.85, y: 40 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.9, y: 20 }}
           transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
           className="relative w-full max-w-2xl rounded-3xl overflow-hidden"
           style={{ background: 'linear-gradient(145deg, #0A0A18 0%, #08080F 100%)', border: '1px solid rgba(124,58,237,0.3)' }}
        >
          {/* Glow */}
          <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-80 h-60 rounded-full pointer-events-none"
               style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.25) 0%, transparent 70%)', filter: 'blur(30px)' }} />

          {/* Header */}
          <div className="relative z-10 px-8 pt-10 pb-6 text-center border-b border-white/[0.06]">
            <div className="flex items-center justify-center mb-4">
              <motion.div
                animate={{ boxShadow: ['0 0 20px rgba(124,58,237,0.4)', '0 0 40px rgba(124,58,237,0.7)', '0 0 20px rgba(124,58,237,0.4)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #38BDF8)' }}
              >
                <Zap size={26} className="text-white" />
              </motion.div>
            </div>
            <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Acesso Gratuito Expirado
            </h2>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
              Você atingiu o limite de importações grátis. Para continuar analisando dados de forma ilimitada, assine um plano PRO.
            </p>
          </div>

          {/* Plans */}
          <div className="relative z-10 p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monthly */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all cursor-pointer group flex flex-col"
              style={{ background: 'rgba(255,255,255,0.03)' }}
              onClick={() => onChoosePlan('monthly')}
            >
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Plano Mensal</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>R$ {MONTHLY_PRICE.toFixed(2).replace('.', ',')}</span>
              </div>
              <p className="text-slate-500 text-xs mb-5">por mês · cancele quando quiser</p>
              <ul className="space-y-2 mb-6 flex-1">
                {planFeatures.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                    <Check size={13} className="text-slate-500 mt-0.5 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl font-bold text-sm border border-white/15 text-white hover:bg-white/10 group-hover:border-white/30 transition-all">
                Escolher Mensal
              </button>
            </motion.div>

            {/* Annual — HIGHLIGHTED */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-6 border relative overflow-hidden cursor-pointer group transition-all hover:scale-[1.02] flex flex-col"
              style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.18), rgba(56,189,248,0.08))', borderColor: 'rgba(124,58,237,0.5)', boxShadow: '0 0 50px -15px rgba(124,58,237,0.4)' }}
              onClick={() => onChoosePlan('annual')}
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-black" style={{ background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', color: '#fff' }}>
                ⭐ -{DISCOUNT_PERCENT}%
              </div>
              <p className="text-xs font-bold text-purple-300 uppercase tracking-widest mb-3">Plano Anual</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>R$ {ANNUAL_EQUIV.toFixed(2).replace('.', ',')}</span>
              </div>
              <p className="text-xs mb-5" style={{ color: '#A78BFA' }}>
                por mês · total de <span className="text-white font-bold">R$ {ANNUAL_TOTAL.toFixed(2).replace('.', ',')}</span>/ano
                <br/>
                <span className="text-emerald-400 font-bold mt-1 inline-block">Economia de R$ {ANNUAL_DISCOUNT.toFixed(2).replace('.', ',')}!</span>
              </p>
              <ul className="space-y-2 mb-6">
                {planFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check size={13} className="text-purple-400 mt-0.5 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button className="group w-full py-3 rounded-xl font-black text-sm text-white transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', boxShadow: '0 0 30px -5px rgba(124,58,237,0.6)' }}>
                🚀 Comprar Agora <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Close */}
          {onClose && (
            <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all z-20">
              <X size={18} />
            </button>
          )}

          {/* Guarantee */}
          <div className="px-8 pb-8 text-center relative z-10">
            <p className="text-xs text-slate-600 flex items-center justify-center gap-2">
              <Shield size={13} className="text-emerald-600" />
              7 dias de garantia — reembolso total sem perguntas
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
