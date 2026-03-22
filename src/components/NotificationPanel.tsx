import React from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Notification } from '../types';

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationPanel = ({ notifications, onClose, onMarkRead, onMarkAllRead }: NotificationPanelProps) => {
  const unread = notifications.filter(n => !n.read).length;
  const icons = {
    success: <CheckCircle size={16} className="text-[#bd9dff]" />,
    warning: <AlertTriangle size={16} className="text-[#f59e0b]" />,
    info: <Info size={16} className="text-[#60a5fa]" />,
  };

  return (
    <div className="absolute right-0 top-14 w-96 bg-[#131319] border border-[#48474d]/30 rounded-2xl shadow-[0_16px_64px_rgba(0,0,0,0.6)] z-50 overflow-hidden animate-[fadeIn_0.15s_ease]">
      <div className="flex items-center justify-between p-6 border-b border-[#48474d]/20">
        <div>
          <h4 className="font-headline text-lg font-bold text-[#f9f5fd]">Notificações</h4>
          {unread > 0 && <p className="font-label text-xs text-[#a88cfb] mt-0.5">{unread} não lida{unread > 1 ? 's' : ''}</p>}
        </div>
        <div className="flex items-center gap-3">
          {unread > 0 && (
            <button onClick={onMarkAllRead} className="font-label text-xs text-[#bd9dff] hover:text-[#f9f5fd] transition-colors">
              Marcar todas
            </button>
          )}
          <button onClick={onClose} className="text-[#a88cfb] hover:text-[#f9f5fd] transition-colors"><X size={18} /></button>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => onMarkRead(n.id)}
            className={`p-5 border-b border-[#48474d]/10 cursor-pointer hover:bg-[#1f1f26] transition-colors flex gap-4 ${!n.read ? 'bg-[#1f1f26]/50' : ''}`}
          >
            <div className="mt-0.5 shrink-0">{icons[n.type]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`font-body text-sm font-bold ${n.read ? 'text-[#a88cfb]' : 'text-[#f9f5fd]'}`}>{n.title}</p>
                {!n.read && <span className="w-2 h-2 rounded-full bg-[#bd9dff] shadow-[0_0_6px_#bd9dff] shrink-0 mt-1" />}
              </div>
              <p className="font-label text-xs text-[#48474d] mt-1 leading-relaxed">{n.message}</p>
              <p className="font-label text-[10px] text-[#a88cfb]/60 mt-2 uppercase tracking-widest">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
