import React, { useState } from 'react';
import { ThemeColors } from '../types';
import { THEMES } from '../themes';
import { X, Palette, Check } from 'lucide-react';

interface ThemePanelProps {
  current: ThemeColors;
  onSelect: (t: ThemeColors) => void;
  onClose: () => void;
}

export const ThemePanel = ({ current, onSelect, onClose }: ThemePanelProps) => (
  <div className="fixed inset-0 z-50 flex justify-end">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-80 h-full flex flex-col shadow-2xl animate-slide-in" style={{ background: 'var(--bg-card)', borderLeft: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <Palette size={20} style={{ color: 'var(--primary)' }} />
          <span className="font-headline text-lg font-bold" style={{ color: 'var(--text)' }}>Temas</span>
        </div>
        <button onClick={onClose} style={{ color: 'var(--text-muted)' }} className="hover:opacity-70 transition-opacity"><X size={18} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {Object.values(THEMES).map(theme => (
          <button
            key={theme.id}
            onClick={() => onSelect(theme)}
            className="w-full flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02] text-left"
            style={{
              background: current.id === theme.id ? `${theme.primary}20` : theme.bg,
              border: `1.5px solid ${current.id === theme.id ? theme.primary : 'transparent'}`,
            }}
          >
            <span className="text-2xl">{theme.emoji}</span>
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: theme.text }}>{theme.name}</p>
              <div className="flex gap-1.5 mt-2">
                {[theme.bg, theme.primary, theme.accent, theme.text].map((c, i) => (
                  <div key={i} className="w-4 h-4 rounded-full border border-white/10" style={{ background: c }} />
                ))}
              </div>
            </div>
            {current.id === theme.id && <Check size={16} style={{ color: theme.primary }} />}
          </button>
        ))}
      </div>
      <div className="p-5 border-t text-center" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>NEXUS BI · Tema personalizado em breve</p>
      </div>
    </div>
  </div>
);
