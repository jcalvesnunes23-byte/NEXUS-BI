import React, { useState, useMemo } from 'react';
import { INITIAL_FILES } from '../data';
import { DataRow, FileDetailModal, SearchBar } from '../components/DataComponents';
import { UploadPanel } from '../components/UploadPanel';
import { FileRecord } from '../types';
import { Database, Filter } from 'lucide-react';

const CATEGORIES = ['Todos', 'Telemetria', 'Logs', 'Financeiro', 'Backup', 'IA', 'Segurança', 'Compliance'];
const STATUSES = ['Todos', 'Criptografado', 'Processando', 'Arquivado'];

export const CofresPage = () => {
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [catFilter, setCatFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const filtered = useMemo(() => INITIAL_FILES.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'Todos' || f.category === catFilter;
    const matchStatus = statusFilter === 'Todos' || f.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  }), [search, catFilter, statusFilter]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-headline text-[3.5rem] leading-[0.9] font-bold tracking-tighter text-[#f9f5fd]">Cofres de<br />Dados</h2>
        <p className="font-body text-lg text-[#a88cfb] mt-6 max-w-lg leading-relaxed">Gerencie e monitore todos os arquivos armazenados nos nós quânticos globais.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          {/* Filters */}
          <div className="bg-[#131319] rounded-2xl p-6">
            <div className="flex flex-wrap items-center gap-4">
              <SearchBar value={search} onChange={setSearch} />
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={14} className="text-[#a88cfb]" />
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-md font-label text-[11px] font-bold uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-[#bd9dff]/15 text-[#bd9dff]' : 'text-[#48474d] hover:text-[#a88cfb] hover:bg-[#1f1f26]'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap mt-4">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCatFilter(c)}
                  className={`px-3 py-1 rounded-md font-label text-[11px] font-bold transition-all ${catFilter === c ? 'bg-[#25252d] text-[#f9f5fd]' : 'text-[#48474d] hover:text-[#a88cfb]'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* File List */}
          <div className="bg-[#131319] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline text-xl font-bold text-[#f9f5fd]">
                {filtered.length} arquivo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
              </h3>
              <div className="flex items-center gap-2 text-[#a88cfb]">
                <Database size={16} />
                <span className="font-label text-xs">{INITIAL_FILES.length} total</span>
              </div>
            </div>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-[#48474d]">
                <Database size={40} strokeWidth={1} className="mb-4" />
                <p className="font-body text-base font-bold">Nenhum arquivo encontrado</p>
                <p className="font-label text-sm mt-1">Tente ajustar os filtros</p>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Header */}
                <div className="flex items-center py-2 px-6 text-[10px] font-label font-bold uppercase tracking-widest text-[#48474d]">
                  <div className="w-2/5">Arquivo</div>
                  <div className="w-1/5">Status</div>
                  <div className="w-1/5">Data</div>
                  <div className="w-1/5 text-right">Tamanho</div>
                </div>
                {filtered.map(f => <DataRow key={f.id} file={f} onClick={setSelectedFile} />)}
              </div>
            )}
          </div>
        </div>

        <UploadPanel />
      </div>

      <FileDetailModal file={selectedFile} onClose={() => setSelectedFile(null)} />
    </div>
  );
};
