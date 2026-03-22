import React from 'react';
import { Database, ChevronRight, Search, X } from 'lucide-react';
import { FileRecord } from './types';

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    'Criptografado': { bg: 'bg-[#bd9dff]/10', text: 'text-[#bd9dff]', dot: 'bg-[#bd9dff] shadow-[0_0_8px_#bd9dff]' },
    'Processando':   { bg: 'bg-[#8a4cfc]/10', text: 'text-[#8a4cfc]', dot: 'bg-[#8a4cfc] animate-pulse' },
    'Arquivado':     { bg: 'bg-[#000000]',    text: 'text-[#a88cfb]', dot: 'bg-[#48474d]' },
  }[status] ?? { bg: 'bg-[#000000]', text: 'text-[#a88cfb]', dot: 'bg-[#48474d]' };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-label text-[10px] font-bold uppercase tracking-widest ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
};

interface DataRowProps {
  file: FileRecord;
  onClick: (f: FileRecord) => void;
}

export const DataRow = ({ file, onClick }: DataRowProps) => (
  <div
    onClick={() => onClick(file)}
    className="flex items-center justify-between py-5 px-6 rounded-xl hover:bg-[#1f1f26] transition-all duration-300 group cursor-pointer"
  >
    <div className="flex items-center gap-5 w-2/5">
      <div className="w-12 h-12 rounded-xl bg-[#000000] flex items-center justify-center text-[#bd9dff] group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(189,157,255,0.15)] transition-all duration-300">
        <Database size={20} strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-body text-base font-bold text-[#f9f5fd]">{file.name}</p>
        <p className="font-label text-xs text-[#a88cfb] mt-1.5 tracking-widest uppercase">{file.id}</p>
      </div>
    </div>
    <div className="w-1/5"><StatusBadge status={file.status} /></div>
    <div className="w-1/5 font-label text-sm text-[#a88cfb] font-medium">{file.date}</div>
    <div className="w-1/5 text-right font-label text-sm text-[#f9f5fd] font-bold">{file.size}</div>
    <div className="w-12 flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0">
      <div className="w-8 h-8 rounded-full bg-[#25252d] flex items-center justify-center text-[#bd9dff]">
        <ChevronRight size={16} strokeWidth={2} />
      </div>
    </div>
  </div>
);

interface FileDetailModalProps {
  file: FileRecord | null;
  onClose: () => void;
}

export const FileDetailModal = ({ file, onClose }: FileDetailModalProps) => {
  if (!file) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#131319] border border-[#48474d]/30 rounded-2xl p-10 w-full max-w-lg shadow-[0_0_80px_rgba(138,76,252,0.15)] animate-[fadeIn_0.2s_ease]">
        <button onClick={onClose} className="absolute top-5 right-5 text-[#a88cfb] hover:text-[#f9f5fd] transition-colors">
          <X size={20} />
        </button>
        <div className="w-14 h-14 rounded-xl bg-[#000000] flex items-center justify-center text-[#bd9dff] mb-6 shadow-[0_0_20px_rgba(189,157,255,0.15)]">
          <Database size={24} strokeWidth={1.5} />
        </div>
        <h3 className="font-headline text-2xl font-bold text-[#f9f5fd] mb-1">{file.name}</h3>
        <p className="font-label text-xs text-[#a88cfb] tracking-widest uppercase mb-8">{file.id}</p>
        <div className="space-y-4">
          {[
            { label: 'Status', value: file.status },
            { label: 'Categoria', value: file.category },
            { label: 'Tamanho', value: file.size },
            { label: 'Data de Criação', value: file.date },
            { label: 'Protocolo', value: 'AES-256-GCM' },
            { label: 'Nós de Replicação', value: '6 nós globais' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-3 border-b border-[#48474d]/20">
              <span className="font-label text-xs text-[#a88cfb] uppercase tracking-widest">{label}</span>
              <span className="font-body text-sm font-bold text-[#f9f5fd]">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-md border border-[#48474d]/30 text-[#a88cfb] font-label text-sm font-bold hover:border-[#bd9dff]/50 hover:text-[#bd9dff] transition-all"
          >
            Fechar
          </button>
          <button className="flex-1 py-3 rounded-md bg-gradient-to-r from-[#bd9dff] to-[#8a4cfc] text-[#3c0089] font-label text-sm font-bold hover:shadow-[0_0_24px_rgba(189,157,255,0.4)] transition-all">
            Baixar
          </button>
        </div>
      </div>
    </div>
  );
};

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="relative group w-72">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a88cfb] group-focus-within:text-[#bd9dff] transition-colors">
      <Search size={18} />
    </div>
    <input
      type="text"
      placeholder="Buscar arquivos..."
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-[#000000] border border-[#48474d]/20 rounded-md py-3.5 pl-12 pr-5 font-label text-sm text-[#f9f5fd] placeholder:text-[#48474d] focus:outline-none focus:border-[#bd9dff] focus:shadow-[0_0_16px_rgba(189,157,255,0.2)] transition-all duration-300"
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#48474d] hover:text-[#a88cfb] transition-colors"
      >
        <X size={14} />
      </button>
    )}
  </div>
);
