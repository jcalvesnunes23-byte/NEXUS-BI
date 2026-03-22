import React, { useState } from 'react';
import { FileSystemItem } from '../types';
import {
  FolderOpen, Folder, LayoutDashboard, Plus, ChevronRight, ChevronDown,
  MoreVertical, Pencil, Trash2, Upload, Zap
} from 'lucide-react';

interface SidebarProps {
  items: FileSystemItem[];
  activeId: string | null;
  onSelect: (item: FileSystemItem) => void;
  onCreateFolder: (name: string, parentId: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onMove: (id: string, newParentId: string | null) => void;
  onImport: () => void;
  onOpenVault: () => void;
  getChildren: (parentId: string) => FileSystemItem[];
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  userFullName?: string | null;
  userAvatar?: string | null;
  onProfileClick?: () => void;
}

interface TreeNodeProps {
  key?: string | number;
  item: FileSystemItem;
  depth: number;
  activeId: string | null;
  onSelect: (item: FileSystemItem) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onCreateFolder: (name: string, parentId: string) => void;
  onMove: (id: string, newParentId: string | null) => void;
  getChildren: (parentId: string) => FileSystemItem[];
}

const TreeNode = ({ item, depth, activeId, onSelect, onDelete, onRename, onCreateFolder, onMove, getChildren }: TreeNodeProps) => {
  const [open, setOpen] = useState(depth === 0);
  const [ctx, setCtx] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(item.name);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const children = item.type === 'folder' ? getChildren(item.id) : [];
  const isActive = activeId === item.id;

  const handleRename = () => {
    if (editVal.trim() && editVal !== item.name) onRename(item.id, editVal.trim());
    setEditing(false); setCtx(false);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) { onCreateFolder(newFolderName.trim(), item.id); setCreatingFolder(false); setNewFolderName(''); }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/nexus-file-id', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (item.type === 'folder') {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (item.type === 'folder') {
      e.preventDefault();
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    setIsDragOver(false);
    if (item.type !== 'folder') return;
    const draggedId = e.dataTransfer.getData('application/nexus-file-id');
    if (draggedId && draggedId !== item.id) {
      onMove(draggedId, item.id);
    }
  };

  return (
    <div className="select-none">
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group relative transition-all"
        style={{
          marginLeft: depth * 12,
          background: isDragOver ? 'var(--primary)40' : isActive ? 'var(--primary)25' : 'transparent',
          border: isDragOver ? '1px dashed var(--primary)' : isActive ? '1px solid var(--primary)50' : '1px solid transparent',
          color: isActive ? 'var(--accent)' : 'var(--text-muted)',
        }}
        onClick={(e) => { e.stopPropagation(); if (item.type === 'folder') setOpen(v => !v); onSelect(item); }}
        onPointerUp={(e) => { if(e.button === 0) { e.stopPropagation(); if (item.type === 'folder') setOpen(v => !v); onSelect(item); } }}
        onContextMenu={e => { e.preventDefault(); setCtx(v => !v); }}
      >
        {item.type === 'folder' ? (
          open || isDragOver ? <FolderOpen size={15} /> : <Folder size={15} />
        ) : (
          <LayoutDashboard size={15} />
        )}
        {editing ? (
          <input
            autoFocus
            value={editVal}
            onChange={e => setEditVal(e.target.value)}
            onBlur={handleRename}
            onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditing(false); }}
            className="flex-1 bg-transparent text-xs font-medium outline-none border-b"
            style={{ borderColor: 'var(--primary)', color: 'var(--text)' }}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 text-xs font-medium truncate" style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>
            {item.name}
          </span>
        )}
        {item.type === 'folder' && (
          open ? <ChevronDown size={11} className="shrink-0" /> : <ChevronRight size={11} className="shrink-0" />
        )}
        <button
          onClick={e => { e.stopPropagation(); setCtx(v => !v); }}
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
          style={{ color: 'var(--text-muted)' }}
        >
          <MoreVertical size={11} />
        </button>
      </div>

      {/* Context Menu */}
      {ctx && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setCtx(false)} onContextMenu={e => { e.preventDefault(); setCtx(false); }} />
          <div className="absolute left-full top-0 z-50 ml-1 w-40 rounded-xl py-2 shadow-2xl text-xs animate-fade-in"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <button onClick={() => { setEditing(true); setCtx(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:opacity-70 transition-opacity" style={{ color: 'var(--text)' }}>
              <Pencil size={13} /> Renomear
            </button>
            {item.type === 'folder' && (
              <button onClick={() => { setCreatingFolder(true); setCtx(false); setOpen(true); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:opacity-70 transition-opacity" style={{ color: 'var(--text)' }}>
                <Plus size={13} /> Nova Subpasta
              </button>
            )}
            <hr style={{ borderColor: 'var(--border)', margin: '4px 0' }} />
            <button onClick={() => { onDelete(item.id); setCtx(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:opacity-70 transition-opacity" style={{ color: '#F87171' }}>
              <Trash2 size={13} /> Excluir
            </button>
          </div>
        </>
      )}

      {/* Children */}
      {item.type === 'folder' && (open || isDragOver) && (
        <div>
          {children.map(child => (
            <TreeNode key={child.id} item={child} depth={depth + 1} activeId={activeId}
              onSelect={onSelect} onDelete={onDelete} onRename={onRename}
              onCreateFolder={onCreateFolder} onMove={onMove} getChildren={getChildren} />
          ))}
          {creatingFolder && (
            <div style={{ marginLeft: (depth + 1) * 12 }} className="px-3 py-1.5">
              <input
                autoFocus
                placeholder="Nome da pasta..."
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                onBlur={() => { if (!newFolderName.trim()) setCreatingFolder(false); }}
                onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') setCreatingFolder(false); }}
                className="w-full text-xs px-3 py-2 rounded-lg outline-none"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--primary)', color: 'var(--text)' }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({ items, activeId, onSelect, onCreateFolder, onDelete, onRename, onMove, onImport, onOpenVault, getChildren, mobileOpen, onCloseMobile, userFullName, userAvatar, onProfileClick }: SidebarProps) => {
  const root = items.find(it => it.id === 'root');
  const [isRootDragOver, setIsRootDragOver] = useState(false);

  // Root drop handlers
  const handleRootDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleRootDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsRootDragOver(true);
  };
  const handleRootDragLeave = () => {
    setIsRootDragOver(false);
  };
  const handleRootDrop = (e: React.DragEvent) => {
    setIsRootDragOver(false);
    const draggedId = e.dataTransfer.getData('application/nexus-file-id');
    if (draggedId && draggedId !== 'root') {
      onMove(draggedId, 'root');
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside className={`fixed left-0 top-0 h-full w-64 flex flex-col z-40 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}>
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-headline text-2xl font-black leading-none tracking-tight" style={{ color: 'var(--text)' }}>NEXUS BI</h1>
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold mt-0.5" style={{ color: 'var(--accent)' }}>Analytics Platform</p>
          </div>
        </div>
      </div>

      {/* Import & Vault Buttons */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        <button
          onClick={onImport}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 hover:scale-[1.01]"
          style={{ background: `linear-gradient(135deg, var(--primary), var(--accent))`, color: '#fff' }}
        >
          <Upload size={16} /> Importar Planilha
        </button>
        <button
          onClick={onOpenVault}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 hover:scale-[1.01]"
          style={{ background: 'var(--bg-input)', color: 'var(--text)', border: '1px solid var(--border)' }}
        >
          <Folder size={16} style={{ color: 'var(--accent)' }}/> Cofres de Dados
        </button>
      </div>

      {/* File Tree */}
      <div 
        className="flex items-center justify-between px-4 mb-2 py-1 rounded transition-colors"
        style={{ background: isRootDragOver ? 'var(--primary)20' : 'transparent' }}
        onDragOver={handleRootDragOver}
        onDragEnter={handleRootDragEnter}
        onDragLeave={handleRootDragLeave}
        onDrop={handleRootDrop}
      >
        <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>Meus Arquivos</span>
        <button
          onClick={() => { if (root) onCreateFolder('Nova Pasta', 'root'); }}
          className="w-6 h-6 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ background: 'var(--primary)20', color: 'var(--accent)' }}
          title="Nova Pasta na Raiz"
        >
          <Plus size={13} />
        </button>
      </div>

      <div 
        className="flex-1 overflow-y-auto px-2 space-y-0.5 relative"
        onDragOver={handleRootDragOver}
        onDragEnter={handleRootDragEnter}
        onDragLeave={handleRootDragLeave}
        onDrop={handleRootDrop}
      >
        {root && getChildren('root').map(child => (
          <TreeNode key={child.id} item={child} depth={0} activeId={activeId}
            onSelect={onSelect} onDelete={onDelete} onRename={onRename}
            onCreateFolder={onCreateFolder} onMove={onMove} getChildren={getChildren} />
        ))}
        {getChildren('root').length === 0 && (
          <div className="p-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="block opacity-50 mb-1">📂</span>
            Nenhuma pasta<br/>criada ainda
          </div>
        )}
      </div>

      {/* User */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div 
          onClick={onProfileClick}
          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
          style={{ background: 'var(--bg-input)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white overflow-hidden shadow-sm"
            style={{ background: 'var(--primary)' }}>
            {userAvatar ? (
               <img src={userAvatar} className="w-full h-full object-cover" />
            ) : (
               (userFullName || 'N').charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>
              {userFullName || 'Configurar Perfil'}
            </p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Meu Perfil</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};
