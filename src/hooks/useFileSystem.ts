import { useState, useCallback, useEffect } from 'react';
import { FileSystemItem, SavedDashboard } from '../types';
import { supabase } from '../lib/supabase';

const defaultFS: FileSystemItem[] = [
  { id: 'root', name: 'Meus Arquivos', type: 'folder', parentId: null, children: [], createdAt: new Date().toISOString() },
];

export function useFileSystem() {
  const [items, setItems] = useState<FileSystemItem[]>(defaultFS);
  const [userId, setUserId] = useState<string | null>(null);

  // Load from Supabase on mount
  useEffect(() => {
    const fetchFS = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      setUserId(session.user.id);

      const { data, error } = await supabase.from('files').select('*').eq('user_id', session.user.id);
      if (!error && data) {
        // Build the tree
        const dbItems: FileSystemItem[] = data.map(r => ({
          id: r.id,
          name: r.name,
          type: r.type as any,
          parentId: r.parent_id || 'root',
          data: r.data,
          createdAt: r.created_at,
          children: []
        }));

        dbItems.forEach(item => {
          item.children = dbItems.filter(child => child.parentId === item.id).map(c => c.id);
        });

        const rootChildren = dbItems.filter(child => child.parentId === 'root').map(c => c.id);
        
        setItems([
          { id: 'root', name: 'Meus Arquivos', type: 'folder', parentId: null, children: rootChildren, createdAt: new Date().toISOString() },
          ...dbItems
        ]);
      }
    };
    fetchFS();
  }, []);

  const createFolder = useCallback(async (name: string, parentId: string) => {
    const id = crypto.randomUUID();
    const newItem: FileSystemItem = { id, name, type: 'folder', parentId, children: [], createdAt: new Date().toISOString() };
    
    setItems(prev => {
      const next = prev.map(it => it.id === parentId ? { ...it, children: [...(it.children ?? []), id] } : it);
      next.push(newItem);
      return next;
    });

    if (userId) {
      await supabase.from('files').insert({
        id,
        user_id: userId,
        parent_id: parentId === 'root' ? null : parentId,
        name,
        type: 'folder'
      });
    }
    return id;
  }, [userId]);

  const saveDashboard = useCallback(async (dashboard: SavedDashboard, parentId: string) => {
    setItems(prev => {
      const existing = prev.find(it => it.type === 'dashboard' && it.data?.id === dashboard.id);
      if (existing) {
        const next = prev.map(it => it.id === existing.id ? { ...it, data: dashboard } : it);
        return next;
      }
      const id = crypto.randomUUID();
      dashboard.id = id; // Sync the dashboard inner ID with the file system UUID
      const next = prev.map(it => it.id === parentId ? { ...it, children: [...(it.children ?? []), id] } : it);
      next.push({ id, name: dashboard.name, type: 'dashboard', parentId, data: dashboard, createdAt: new Date().toISOString() });
      return next;
    });

    if (userId) {
      const { data: existingRecords } = await supabase.from('files').select('id').eq('user_id', userId).eq('id', dashboard.id);
      
      if (existingRecords && existingRecords.length > 0) {
        await supabase.from('files').update({ data: dashboard as any }).eq('id', dashboard.id).eq('user_id', userId);
      } else {
        await supabase.from('files').insert({
          id: dashboard.id,
          user_id: userId,
          parent_id: parentId === 'root' ? null : parentId,
          name: dashboard.name,
          type: 'file', // Supabase check accepts 'folder' or 'file' (using 'file' for dashboard)
          data: dashboard as any
        });
      }
    }
  }, [userId]);

  const renameItem = useCallback(async (id: string, newName: string) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, name: newName } : it));
    if (userId) {
      await supabase.from('files').update({ name: newName }).eq('id', id).eq('user_id', userId);
    }
  }, [userId]);

  const deleteItem = useCallback(async (id: string) => {
    const toDelete = new Set<string>();
    setItems(prev => {
      const collectIds = (itemId: string) => {
        toDelete.add(itemId);
        const item = prev.find(it => it.id === itemId);
        item?.children?.forEach(childId => collectIds(childId));
      };
      collectIds(id);
      return prev
        .filter(it => !toDelete.has(it.id))
        .map(it => ({ ...it, children: it.children?.filter(c => !toDelete.has(c)) }));
    });

    if (userId) {
      for (const delId of Array.from(toDelete).reverse()) {
        await supabase.from('files').delete().eq('id', delId).eq('user_id', userId);
      }
    }
  }, [userId]);

  const moveItem = useCallback(async (id: string, newParentId: string | null) => {
    setItems(prev => {
      const itemToMove = prev.find(it => it.id === id);
      if (!itemToMove || itemToMove.parentId === newParentId || id === newParentId) return prev;
      
      if (itemToMove.type === 'folder') {
        let isDescendant = false;
        const checkDescendant = (currentId: string | null) => {
          if (currentId === id) isDescendant = true;
          if (!currentId || isDescendant) return;
          const currentItem = prev.find(it => it.id === currentId);
          if (currentItem?.parentId) checkDescendant(currentItem.parentId);
        };
        checkDescendant(newParentId);
        if (isDescendant) return prev;
      }

      return prev.map(it => {
        if (it.id === itemToMove.parentId) return { ...it, children: it.children?.filter(childId => childId !== id) };
        if (it.id === newParentId) return { ...it, children: [...(it.children ?? []), id] };
        if (it.id === id) return { ...it, parentId: newParentId };
        return it;
      });
    });

    if (userId) {
      await supabase.from('files').update({ 
        parent_id: newParentId === 'root' || newParentId === null ? null : newParentId 
      }).eq('id', id).eq('user_id', userId);
    }
  }, [userId]);

  const getChildren = useCallback((parentId: string): FileSystemItem[] => {
    const parent = items.find(it => it.id === parentId);
    if (!parent?.children) return [];
    return parent.children.map(cid => items.find(it => it.id === cid)).filter(Boolean) as FileSystemItem[];
  }, [items]);

  return { items, createFolder, saveDashboard, renameItem, deleteItem, getChildren, moveItem };
}
