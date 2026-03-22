import React, { useState } from 'react';
import { FileSystemItem } from '../types';
import { Folder, LayoutDashboard, ChevronRight, Plus, Trash2, Pencil, ArrowLeft } from 'lucide-react';

interface FileManagerPageProps {
  items: FileSystemItem[];
  currentFolderId: string;
  onNavigateFolder: (id: string) => void;
  getChildren: (id: string) => FileSystemItem[];
  onCreateFolder: (name: string, parentId: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onMove: (id: string, newParentId: string | null) => void;
  onOpenItem: (item: FileSystemItem) => void;
}

export const FileManagerPage = ({ items, currentFolderId, onNavigateFolder, getChildren, onCreateFolder, onDelete, onRename, onMove, onOpenItem }: FileManagerPageProps) => {
  const [ctx, setCtx] = useState<{ id: string, x: number, y: number } | null>(null);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isDragOver, setIsDragOver] = useState<string | null>(null);

  // Built simple breadcrumb
  const getBreadcrumbs = () => {
    let current = items.find(it => it.id === currentFolderId);
    if (!current) return [{ id: 'root', name: 'Raiz' }];
    const crumbs = [];
    while (current && current.id !== 'root') {
      crumbs.unshift({ id: current.id, name: current.name });
      current = items.find(it => it.id === current.parentId);
    }
    crumbs.unshift({ id: 'root', name: 'Raiz' });
    return crumbs;
  };

  const children = getChildren(currentFolderId);

  const handleCreate = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), currentFolderId);
      setNewFolderName('');
      setCreatingFolder(false);
    }
  };

  const handleRename = () => {
    if (editingId && editName.trim()) {
      onRename(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 px-8" style={{ color: 'var(--text)' }}>
      {/* Header and Breadcrumbs */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-2 text-xl font-headline font-bold">
          {getBreadcrumbs().map((crumb, idx, arr) => (
            <React.Fragment key={crumb.id}>
              <button 
                onClick={() => onNavigateFolder(crumb.id)}
                className="hover:opacity-70 transition-opacity"
                style={{ color: idx === arr.length - 1 ? 'var(--text)' : 'var(--text-muted)' }}
              >
                {crumb.name}
              </button>
              {idx < arr.length - 1 && <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />}
            </React.Fragment>
          ))}
        </div>
        <button
          onClick={() => setCreatingFolder(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 shadow-md shadow-purple-500/20"
          style={{ background: 'var(--primary)', color: '#fff' }}
        >
          <Plus size={16} /> Nova Pasta
        </button>
      </div>

      {creatingFolder && (
        <div className="mb-6 w-full max-w-sm">
          <input
            autoFocus
            placeholder="Nome da nova pasta..."
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            onBlur={() => { if (!newFolderName.trim()) setCreatingFolder(false); }}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreatingFolder(false); }}
            className="w-full text-sm px-4 py-3 rounded-xl outline-none shadow-xl"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--primary)', color: 'var(--text)' }}
          />
        </div>
      )}

      {/* Grid */}
      <div 
        className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 content-start pb-8"
        onClick={() => setCtx(null)}
      >
        {children.map(item => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              e.dataTransfer.setData('text/plain', item.id);
            }}
            onDragOver={(e) => {
              if (item.type === 'folder') {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(item.id);
              }
            }}
            onDragLeave={() => setIsDragOver(null)}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(null);
              if (item.type === 'folder') {
                const draggedId = e.dataTransfer.getData('text/plain');
                if (draggedId && draggedId !== item.id) {
                  onMove(draggedId, item.id);
                }
              }
            }}
            onClick={(e) => {
              // Prevent context menu state clearing from bubbling up if item is clicked
              e.stopPropagation();
              setCtx(null);
              if (item.type === 'folder') onNavigateFolder(item.id);
              else onOpenItem(item);
            }}
            onContextMenu={e => {
              e.preventDefault();
              setCtx({ id: item.id, x: e.clientX, y: e.clientY });
            }}
            className={`group flex flex-col items-center justify-center p-6 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl relative border ${isDragOver === item.id ? 'ring-2 ring-purple-500 scale-105' : ''}`}
            style={{ 
              background: isDragOver === item.id ? 'var(--primary)20' : 'var(--bg-card)', 
              borderColor: isDragOver === item.id ? 'var(--primary)' : 'var(--border)' 
            }}
          >
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{ background: 'var(--primary)15', color: item.type === 'folder' ? 'var(--primary)' : 'var(--accent)' }}
            >
              {item.type === 'folder' ? <Folder size={28} /> : <LayoutDashboard size={28} />}
            </div>

            {editingId === item.id ? (
              <input
                autoFocus
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditingId(null); }}
                className="w-full text-center text-sm font-bold truncate outline-none bg-transparent"
                style={{ borderBottom: '1px solid var(--primary)', color: 'var(--text)' }}
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <p className="text-sm font-bold text-center w-full truncate px-2" style={{ color: 'var(--text)' }}>
                {item.name}
              </p>
            )}
            
            <p className="text-[10px] mt-1 uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
              {item.type === 'folder' ? `${getChildren(item.id).length} itens` : 'Dashboard'}
            </p>
          </div>
        ))}
        {children.length === 0 && !creatingFolder && (
          <div className="col-span-full flex flex-col items-center justify-center h-64 text-center opacity-60">
            <Folder size={48} className="mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="text-lg font-bold" style={{ color: 'var(--text-muted)' }}>Esta pasta está vazia</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Importe planilhas na barra lateral ou crie uma nova pasta.</p>
          </div>
        )}
      </div>

      {/* Floating Context Menu */}
      {ctx && (
        <div 
          className="fixed z-50 w-48 rounded-xl py-2 shadow-2xl animate-fade-in backdrop-blur-md"
          style={{ left: ctx.x, top: ctx.y, background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          onClick={e => e.stopPropagation()}
        >
          <button 
            onClick={() => { setEditingId(ctx.id); setEditName(items.find(i => i.id === ctx.id)?.name || ''); setCtx(null); }} 
            className="w-full flex items-center gap-3 px-4 py-3 hover:opacity-70 transition-opacity text-sm font-bold" 
            style={{ color: 'var(--text)' }}
          >
            <Pencil size={14} /> Renomear
          </button>
          <hr style={{ borderColor: 'var(--border)', margin: '4px 0' }} />
          <button 
            onClick={() => { onDelete(ctx.id); setCtx(null); }} 
            className="w-full flex items-center gap-3 px-4 py-3 hover:opacity-70 transition-opacity text-sm font-bold" 
            style={{ color: '#F87171' }}
          >
            <Trash2 size={14} /> Excluir
          </button>
        </div>
      )}
    </div>
  );
};
