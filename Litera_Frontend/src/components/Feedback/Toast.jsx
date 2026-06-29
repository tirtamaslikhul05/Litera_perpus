import React, { useEffect } from 'react';

export default function Toast({ 
  message, 
  type = 'success', 
  onClose, 
  duration = 3000 
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColors = {
    success: 'bg-emerald-600 border-emerald-500 text-white',
    error: 'bg-rose-600 border-rose-500 text-white',
    warning: 'bg-amber-500 border-amber-400 text-slate-900'
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounceIn w-[90%] max-w-sm">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-bold shadow-lg ${bgColors[type]}`}>
        <span>{icons[type]}</span>
        <span className="flex-1">{message}</span>
        <button 
          onClick={onClose} 
          className="bg-transparent border-0 text-current opacity-60 hover:opacity-100 font-bold text-sm cursor-pointer"
        >
          &times;
        </button>
      </div>
    </div>
  );
}