import { ThemeColors } from './types';

export const THEMES: Record<string, ThemeColors> = {
  'dark-purple': {
    id: 'dark-purple', name: 'Dark Roxo', emoji: '🔮',
    bg: '#0A0A0F', bgCard: '#13131A', bgInput: '#0D0D14',
    primary: '#7C3AED', accent: '#A78BFA',
    text: '#E2E8F0', textMuted: '#94A3B8', border: 'rgba(124,58,237,0.2)',
    chart: ['#7C3AED','#A78BFA','#C4B5FD','#5B21B6','#8B5CF6','#DDD6FE'],
  },
  'dark-blue': {
    id: 'dark-blue', name: 'Dark Azul', emoji: '🔵',
    bg: '#050D1A', bgCard: '#0A1628', bgInput: '#071020',
    primary: '#2563EB', accent: '#60A5FA',
    text: '#E2E8F0', textMuted: '#94A3B8', border: 'rgba(37,99,235,0.2)',
    chart: ['#2563EB','#60A5FA','#93C5FD','#1D4ED8','#3B82F6','#BFDBFE'],
  },
  'dark-green': {
    id: 'dark-green', name: 'Dark Verde', emoji: '🟢',
    bg: '#030F07', bgCard: '#061A0C', bgInput: '#041208',
    primary: '#059669', accent: '#34D399',
    text: '#D1FAE5', textMuted: '#6EE7B7', border: 'rgba(5,150,105,0.2)',
    chart: ['#059669','#34D399','#6EE7B7','#047857','#10B981','#A7F3D0'],
  },
  'dark-orange': {
    id: 'dark-orange', name: 'Dark Laranja', emoji: '🟠',
    bg: '#0F0800', bgCard: '#1A0F00', bgInput: '#130B00',
    primary: '#D97706', accent: '#FCD34D',
    text: '#FEF3C7', textMuted: '#FDE68A', border: 'rgba(217,119,6,0.2)',
    chart: ['#D97706','#FCD34D','#FDE68A','#B45309','#F59E0B','#FEF3C7'],
  },
  'light': {
    id: 'light', name: 'Claro Minimalista', emoji: '⚪',
    bg: '#F8FAFC', bgCard: '#FFFFFF', bgInput: '#F1F5F9',
    primary: '#6D28D9', accent: '#7C3AED',
    text: '#1E293B', textMuted: '#64748B', border: 'rgba(109,40,217,0.15)',
    chart: ['#6D28D9','#7C3AED','#A78BFA','#5B21B6','#8B5CF6','#C4B5FD'],
  },
  'dark-red': {
    id: 'dark-red', name: 'Dark Red', emoji: '🔴',
    bg: '#0F0205', bgCard: '#1A0408', bgInput: '#13030A',
    primary: '#DC2626', accent: '#F87171',
    text: '#FEE2E2', textMuted: '#FCA5A5', border: 'rgba(220,38,38,0.2)',
    chart: ['#DC2626','#F87171','#FCA5A5','#B91C1C','#EF4444','#FECACA'],
  },
};

export const DEFAULT_THEME = THEMES['dark-purple'];
