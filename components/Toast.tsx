import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 2000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
        <span className="material-icons-round text-violet-400 text-sm">check_circle</span>
        <span className="text-sm font-bold tracking-wide">{message}</span>
      </div>
    </div>
  );
};