import React, { useState, useMemo } from 'react';
import { SheetData, ThemeColors } from '../types';
import { X, Save, Search } from 'lucide-react';
import { rebuildSheetData } from '../hooks/useSpreadsheet';

interface DataEditorModalProps {
  data: SheetData;
  theme: ThemeColors;
  onClose: () => void;
  onSave: (newData: SheetData) => void;
}

export const DataEditorModal = ({ data, theme, onClose, onSave }: DataEditorModalProps) => {
  const [localData, setLocalData] = useState(() => 
    data.rawData.map((r, i) => ({ ...r, _internalId: i }))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const handleColumnFilter = (colName: string, value: string) => {
    setColumnFilters(prev => ({ ...prev, [colName]: value }));
  };

  const handleCellBlur = (internalId: number, colName: string, newValue: string) => {
    setLocalData(prev => prev.map(row => 
      row._internalId === internalId 
        ? { ...row, [colName]: newValue } 
        : row
    ));
  };

  const handleSave = () => {
    // Remove o _internalId antes de salvar para não sujar o rawData final
    const cleanData = localData.map(({ _internalId, ...rest }) => rest);
    const newData = rebuildSheetData(cleanData, data.fileName, data.sheetNames, data.activeSheet);
    onSave(newData);
  };

  const filteredData = useMemo(() => {
    let result = localData;

    // 1. Filtro global (Search)
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(row => {
        return data.columns.some(col => {
          const val = row[col.name];
          return val != null && String(val).toLowerCase().includes(lowerTerm);
        });
      });
    }

    // 2. Filtros por coluna
    for (const [colName, valQuery] of Object.entries(columnFilters)) {
      if (valQuery) {
        result = result.filter(row => {
          const cellVal = String(row[colName] ?? '');
          return cellVal === valQuery;
        });
      }
    }

    return result;
  }, [localData, searchTerm, data.columns, columnFilters]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-6xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border"
        style={{ backgroundColor: theme.bgCard, borderColor: theme.border }}
      >
        <div className="flex items-center justify-between p-4 border-b gap-4" style={{ borderColor: theme.border }}>
          <h2 className="text-xl font-bold font-headline shrink-0" style={{ color: theme.text }}>Editor de Dados</h2>
          
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={16} style={{ color: theme.text }} />
            <input 
              type="text"
              placeholder="Pesquisar em todas as colunas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border outline-none transition-all focus:ring-2"
              style={{ 
                backgroundColor: theme.bgInput, 
                borderColor: theme.border,
                color: theme.text,
                '--tw-ring-color': theme.primary
              } as any}
            />
          </div>

          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors shrink-0" style={{ color: theme.textMuted }}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
          <table className="w-full text-left border-collapse text-sm whitespace-nowrap" style={{ color: theme.text }}>
            <thead>
              <tr>
                <th className="p-4 border-b sticky top-0 backdrop-blur-md z-10 align-top max-w-[50px]" style={{ borderColor: theme.border, backgroundColor: `${theme.bgCard}f0` }}>#</th>
                {data.columns.map(col => {
                  // Coleta os valores únicos reais da coluna para montar os Options do filtro dropdown
                  const uniqueVals = Array.from(new Set(localData.map(r => String(r[col.name] ?? '')))).filter(v => typeof v === 'string' && v.trim() !== '').sort() as string[];
                  
                  return (
                    <th key={col.name} className="p-3 border-b font-semibold sticky top-0 backdrop-blur-md z-10 align-top min-w-[150px]" style={{ borderColor: theme.border, backgroundColor: `${theme.bgCard}f0` }}>
                      <div className="flex flex-col gap-2">
                        <span>{col.name}</span>
                        <select 
                          className="w-full h-8 px-2 text-xs rounded-lg border outline-none font-normal shadow-sm cursor-pointer transition-colors hover:opacity-90 active:scale-[0.98]"
                          style={{ backgroundColor: theme.bgInput, borderColor: theme.border, color: theme.textMuted }}
                          value={columnFilters[col.name] || ''}
                          onChange={e => handleColumnFilter(col.name, e.target.value)}
                        >
                          <option value="">Filtro: Todos</option>
                          {uniqueVals.map(val => (
                            <option key={val} value={val}>{val.slice(0, 40)}{val.length > 40 ? '...' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 100).map((row, index) => (
                <tr key={row._internalId} className="border-b transition-colors hover:bg-white/5" style={{ borderColor: theme.border }}>
                  <td className="p-2 opacity-50">{index + 1}</td>
                  {data.columns.map(col => (
                    <td 
                      key={col.name} 
                      className="p-2 outline-none focus:bg-white/10 transition-colors"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleCellBlur(row._internalId, col.name, e.currentTarget.textContent || '')}
                      style={{ borderRight: `1px solid ${theme.border}20` }}
                    >
                      {String(row[col.name] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
             <p className="p-8 text-center opacity-50" style={{ color: theme.text }}>Nenhum registro encontrado para "{searchTerm}".</p>
          )}
          {filteredData.length > 100 && (
             <p className="p-4 text-center text-xs opacity-50" style={{ color: theme.text }}>Exibindo os primeiros 100 resultados de {filteredData.length}. Refine a busca se necessário.</p>
          )}
        </div>

        <div className="flex items-center justify-end p-4 border-t gap-3" style={{ borderColor: theme.border }}>
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
            style={{ color: theme.text }}
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: '#fff' }}
          >
            <Save size={16} />
            Salvar e Atualizar Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
