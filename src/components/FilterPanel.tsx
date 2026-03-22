import React from 'react';
import { SheetData } from '../types';
import { Filter, Calendar, Type, Hash } from 'lucide-react';

interface FilterPanelProps {
  data: SheetData;
  filters: Record<string, string>;
  onFilterChange: (column: string, value: string) => void;
}

export const FilterPanel = ({ data, filters, onFilterChange }: FilterPanelProps) => (
  <div className="rounded-2xl p-5" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
    <div className="flex items-center gap-2 mb-4">
      <Filter size={16} style={{ color: 'var(--primary)' }} />
      <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>Filtros Ativos</span>
    </div>
    
    <div className="flex flex-wrap gap-3">
      {data.columns.map(col => {
        let Icon = Type;
        if (col.type === 'numeric') Icon = Hash;
        if (col.type === 'date') Icon = Calendar;
        
        const uniqueVals = Array.from(new Set(data.rawData.map(r => String(r[col.name] ?? ''))))
          .filter(v => typeof v === 'string' && v.trim() !== '')
          .sort();
        
        // Se a coluna só tiver 1 valor ou 0 valores e não for algo já filtrado, podemos opcionalmente ocultar, 
        // mas vamos manter para ter o mesmo comportamento do Editar Dados.

        return (
          <div key={col.name} className="flex flex-col gap-1.5 min-w-[150px] flex-1">
            <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 truncate" style={{ color: 'var(--text-muted)' }}>
              <Icon size={12} /> {col.name}
            </span>
            <select 
              value={filters[col.name] || ''}
              onChange={(e) => onFilterChange(col.name, e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg outline-none cursor-pointer appearance-none bg-no-repeat bg-[url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%2394A3B8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>')] bg-[position:right_10px_center]"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              <option value="">Todos</option>
              {uniqueVals.map(u => (
                <option key={u} value={u}>{u.slice(0, 40)}{u.length > 40 ? '...' : ''}</option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  </div>
);
