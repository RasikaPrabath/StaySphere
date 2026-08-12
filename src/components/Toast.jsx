import React from 'react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-primary text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between gap-3 animate-slideUp"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary-fixed text-lg">info</span>
            <span>{toast.message}</span>
          </div>
          <button 
            onClick={() => onDismiss(toast.id)}
            className="text-white/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
