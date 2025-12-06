import React, { useState, useEffect } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info';
}

interface NotificationsProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export default function Notifications({ notifications, onRemove }: NotificationsProps) {
  return (
    <div className="fixed top-4 right-4 z-[110] flex flex-col gap-2 pointer-events-none">
      {notifications.map(n => (
        <div 
          key={n.id} 
          className={`pointer-events-auto p-4 rounded-lg shadow-2xl text-white font-medium flex items-center gap-3 animate-fade-in-right w-80 ${n.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}
        >
          <span className="text-2xl">{n.type === 'success' ? '🚀' : '📩'}</span>
          <div>
            <div className="text-xs opacity-75">{n.type === 'success' ? 'Basarili' : 'Bildirim'}</div>
            {n.message}
          </div>
          <button 
            onClick={() => onRemove(n.id)}
            className="ml-auto text-white hover:text-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}