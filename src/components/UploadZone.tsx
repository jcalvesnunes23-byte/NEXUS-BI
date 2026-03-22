import React, { useState, useCallback } from 'react';
import { readSpreadsheet } from '../hooks/useSpreadsheet';
import { SheetData } from '../types';
import { UploadCloud, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  onData: (data: SheetData, mode: 'auto' | 'manual') => void;
}

type Stage = 'idle' | 'preview' | 'processing' | 'done' | 'error';

export const UploadZone = ({ onData }: UploadZoneProps) => {
  const [dragging, setDragging] = useState(false);
  const [stage, setStage] = useState<Stage>('idle');
  const [progress, setProgress] = useState(0);
  const [previewData, setPreviewData] = useState<SheetData | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [error, setError] = useState('');

  const ACCEPT = ['.xlsx','.xls','.xlsm','.xlsb','.csv','.tsv','.ods'];

  const processFile = useCallback(async (file: File) => {
    setError('');
    setStage('processing');
    setProgress(10);
    try {
      const fakeProgress = setInterval(() => setProgress(p => Math.min(p + 15, 85)), 300);
      const data = await readSpreadsheet(file);
      clearInterval(fakeProgress);
      setProgress(100);
      setPreviewData(data);
      setSelectedSheet(data.activeSheet);
      setStage('preview');
    } catch (e) {
      setError('Erro ao ler o arquivo. Verifique se é uma planilha válida.');
      setStage('error');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }, [processFile]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleConfirm = async (mode: 'auto' | 'manual') => {
    if (!previewData) return;
    if (selectedSheet !== previewData.activeSheet) {
      setStage('processing');
      setProgress(30);
      const data = await readSpreadsheet(new File([], previewData.fileName), selectedSheet);
      setProgress(100);
      onData({ ...data, fileName: previewData.fileName }, mode);
    } else {
      onData(previewData, mode);
    }
    setStage('done');
  };

  if (stage === 'idle' || stage === 'error') return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6" style={{ background: 'var(--primary)20' }}>
            <UploadCloud size={36} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 className="font-headline text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Importar Planilha</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Arraste seu arquivo ou clique para selecionar</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl mb-6" style={{ background: '#DC262620', border: '1px solid #DC262640' }}>
            <AlertCircle size={18} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <label
          className="flex flex-col items-center justify-center p-12 rounded-2xl cursor-pointer transition-all duration-300"
          style={{
            border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--border)'}`,
            background: dragging ? 'var(--primary)10' : 'var(--bg-card)',
            transform: dragging ? 'scale(1.01)' : 'scale(1)',
          }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input type="file" accept={ACCEPT.join(',')} className="hidden" onChange={handleInput} />
          <UploadCloud size={40} className="mb-4" style={{ color: dragging ? 'var(--primary)' : 'var(--text-muted)' }} />
          <p className="font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>Arraste e solte aqui</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>ou clique para procurar</p>
          <p className="text-xs px-4 py-2 rounded-lg" style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            {ACCEPT.join(' · ')}
          </p>
        </label>
      </div>
    </div>
  );

  if (stage === 'processing') return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)' }} />
      <div className="w-80 text-center">
        <p className="font-bold mb-4 text-lg" style={{ color: 'var(--text)' }}>Nexus AI Engine</p>
        <div className="w-full rounded-full h-2" style={{ background: 'var(--border)' }}>
          <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))' }} />
        </div>
        <p className="text-sm font-semibold mt-4" style={{ color: 'var(--text)' }}>
          {progress < 30 ? "Extraindo matriz de dados da planilha..." : 
           progress < 60 ? "Higienizando moedas e números com IA heurística..." : 
           progress < 85 ? "Mapeando inferências e gerando Insights..." : 
           "Processo concluído! Desenhando dashboards..."}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Processamento 100% seguro no navegador.</p>
      </div>
    </div>
  );

  if (stage === 'preview' && previewData) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary)20' }}>
            <FileSpreadsheet size={22} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <p className="font-bold" style={{ color: 'var(--text)' }}>{previewData.fileName}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{previewData.rowCount} linhas · {previewData.columns.length} colunas</p>
          </div>
        </div>

        {previewData.sheetNames.length > 1 && (
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: 'var(--text-muted)' }}>
              {previewData.sheetNames.length} abas detectadas — selecione:
            </p>
            <div className="flex flex-wrap gap-2">
              {previewData.sheetNames.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSheet(s)}
                  className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                  style={{
                    background: selectedSheet === s ? 'var(--primary)' : 'var(--bg-card)',
                    border: `1px solid ${selectedSheet === s ? 'var(--primary)' : 'var(--border)'}`,
                    color: selectedSheet === s ? '#fff' : 'var(--text-muted)',
                  }}
                >{s}</button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: 'var(--text-muted)' }}>Colunas detectadas</p>
          <div className="flex flex-wrap gap-2">
            {previewData.columns.slice(0, 12).map(col => (
              <span key={col.name} className="px-3 py-1 rounded-lg text-xs font-bold" style={{
                background: col.type === 'numeric' ? 'var(--primary)20' : col.type === 'date' ? '#06966920' : 'var(--bg)',
                color: col.type === 'numeric' ? 'var(--accent)' : col.type === 'date' ? '#34D399' : 'var(--text-muted)',
              }}>
                {col.type === 'numeric' ? '🔢' : col.type === 'date' ? '📅' : col.type === 'categorical' ? '🏷️' : '📝'} {col.name}
              </span>
            ))}
            {previewData.columns.length > 12 && <span className="px-3 py-1 rounded-lg text-xs" style={{ color: 'var(--text-muted)', background: 'var(--bg)' }}>+{previewData.columns.length - 12}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleConfirm('auto')}
            className="w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
            style={{ background: `linear-gradient(135deg, var(--primary), var(--accent))` }}
          >
            🤖 Modelo Automático (Recomendado)
          </button>
          <button
            onClick={() => handleConfirm('manual')}
            className="w-full py-4 rounded-xl font-bold transition-all hover:opacity-90 hover:scale-[1.01]"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            ⚙️ Montar Manualmente (Vazio)
          </button>
        </div>
      </div>
    </div>
  );

  return null;
};
