import React, { useCallback, useState } from 'react';
import { UploadCloud, Lock, CheckCircle, X } from 'lucide-react';

interface UploadFile {
  name: string;
  size: string;
  progress: number;
  done: boolean;
}

export const UploadPanel = () => {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    Array.from(fileList).forEach(f => {
      const kb = f.size / 1024;
      const size = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
      const entry: UploadFile = { name: f.name, size, progress: 0, done: false };
      setFiles(prev => [...prev, entry]);
      // Simulate progress
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 15 + 5;
        if (p >= 100) { p = 100; clearInterval(interval); }
        setFiles(prev => prev.map(x => x.name === f.name ? { ...x, progress: Math.min(100, p), done: p >= 100 } : x));
      }, 200);
    });
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => processFiles(e.target.files);

  const removeFile = (name: string) => setFiles(prev => prev.filter(f => f.name !== name));

  return (
    <div className="bg-[#1f1f26] rounded-2xl p-10 shadow-kpi-glow flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#bd9dff]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <h3 className="font-headline text-2xl font-bold text-[#f9f5fd] tracking-tight mb-2">Upload Seguro</h3>
      <p className="font-body text-sm text-[#a88cfb] mb-8">Inicialize o protocolo de criptografia quântica para novos conjuntos de dados.</p>

      <label
        className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center transition-all duration-300 cursor-pointer group mb-6 ${
          dragging ? 'border-[#bd9dff] bg-[#bd9dff]/10 scale-[1.01]' : 'border-[#48474d]/30 hover:border-[#bd9dff]/50 hover:bg-[#bd9dff]/5'
        }`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input type="file" multiple className="hidden" onChange={onFileInput} />
        <div className={`w-16 h-16 rounded-full bg-[#000000] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 ${dragging ? 'text-[#bd9dff] scale-110' : 'text-[#a88cfb] group-hover:text-[#bd9dff] group-hover:scale-110'}`}>
          <UploadCloud size={28} />
        </div>
        <p className="font-body text-base font-bold text-[#f9f5fd] mb-2">Arraste e Solte Arquivos</p>
        <p className="font-label text-xs text-[#a88cfb]">ou clique para procurar nos nós locais</p>
      </label>

      {files.length > 0 && (
        <div className="space-y-3 mb-6 max-h-44 overflow-y-auto custom-scrollbar pr-1">
          {files.map(f => (
            <div key={f.name} className="bg-[#0e0e13] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {f.done ? <CheckCircle size={14} className="text-[#bd9dff] shrink-0" /> : <UploadCloud size={14} className="text-[#a88cfb] shrink-0 animate-pulse" />}
                  <span className="font-label text-xs text-[#f9f5fd] truncate">{f.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="font-label text-[10px] text-[#a88cfb]">{f.size}</span>
                  <button onClick={() => removeFile(f.name)} className="text-[#48474d] hover:text-[#a88cfb] transition-colors"><X size={12} /></button>
                </div>
              </div>
              <div className="w-full bg-[#1f1f26] rounded-full h-1">
                <div
                  className="h-1 rounded-full bg-gradient-to-r from-[#8a4cfc] to-[#bd9dff] transition-all duration-300"
                  style={{ width: `${f.progress}%` }}
                />
              </div>
              {f.done && <p className="font-label text-[10px] text-[#bd9dff] mt-1.5">Criptografado com AES-256 ✓</p>}
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#000000] rounded-xl p-5 flex items-start gap-4 border border-[#48474d]/20">
        <Lock size={18} className="text-[#bd9dff] shrink-0 mt-0.5" />
        <div>
          <p className="font-label text-xs font-bold text-[#f9f5fd] mb-1">Criptografia AES-256 Ativa</p>
          <p className="font-label text-[10px] text-[#a88cfb] leading-relaxed">Todos os arquivos são criptografados automaticamente antes de saírem do ambiente local.</p>
        </div>
      </div>
    </div>
  );
};
