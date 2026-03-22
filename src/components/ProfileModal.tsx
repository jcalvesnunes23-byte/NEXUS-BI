import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Camera, Save, Loader2, Mail, Shield, Zap, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  isPro: boolean;
  importCount: number;
  userId: string;
  fullName: string;
  avatarUrl: string;
  onProfileUpdated: () => void;
}

export const ProfileModal = ({
  isOpen, onClose, email, isPro, importCount, userId, fullName, avatarUrl, onProfileUpdated
}: ProfileModalProps) => {
  const [name, setName] = useState(fullName || '');
  const [avatar, setAvatar] = useState(avatarUrl || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').update({ full_name: name }).eq('id', userId);
      if (error) throw error;
      onProfileUpdated();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const newAvatarUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      setAvatar(newAvatarUrl);
      onProfileUpdated();
    } catch (error) {
      console.error('Erro no upload de imagem:', error);
      alert('Houve um erro ao enviar sua foto. Certifique-se de que rodou o script SQL de atualização de perfil no Supabase.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="p-8 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-headline font-bold" style={{ color: 'var(--text)' }}>Meu Perfil</h2>
            <button onClick={onClose} className="p-2 rounded-xl transition-all hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold font-headline overflow-hidden shadow-xl"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: '#fff' }}
              >
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  (name || email || 'N').charAt(0).toUpperCase()
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 w-full h-full rounded-full bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                {uploading ? <Loader2 size={24} className="text-white animate-spin" /> : <Camera size={24} className="text-white mb-1" />}
                {!uploading && <span className="text-[10px] text-white font-bold uppercase">Alterar</span>}
              </button>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleAvatarUpload} />
            </div>
            
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                Nome de Exibição
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Como quer ser chamado?"
                className="w-full px-4 py-3 rounded-xl outline-none font-bold text-lg transition-all"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border)' }} />

          {/* Readonly Info Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-input)' }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--text-muted)' }}>
                <Mail size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">E-mail Cadastrado</span>
              </div>
              <p className="font-bold text-sm truncate" style={{ color: 'var(--text)' }}>{email}</p>
            </div>

            <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-input)' }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--text-muted)' }}>
                <Shield size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Plano Ativo</span>
              </div>
              <p className="font-bold text-sm truncate" style={{ color: isPro ? 'var(--accent)' : 'var(--text)' }}>
                {isPro ? 'PRO (Ilimitado)' : 'Free'}
              </p>
            </div>

            <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-input)' }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--text-muted)' }}>
                <Zap size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Importações</span>
              </div>
              <p className="font-bold text-sm truncate" style={{ color: 'var(--text)' }}>
                {isPro ? '∞' : `${importCount} realizadas`}
              </p>
            </div>

            <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-input)' }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--text-muted)' }}>
                <Calendar size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Acesso</span>
              </div>
              <p className="font-bold text-sm truncate" style={{ color: 'var(--text)' }}>Seguro & Online</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end" style={{ background: 'var(--bg-input)', borderColor: 'var(--border)' }}>
          <button
            onClick={handleSave}
            disabled={saving || (name === fullName)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
