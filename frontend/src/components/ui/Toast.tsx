import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: 'bg-primary-container text-on-primary-container',
    error: 'bg-error-container text-on-error-container',
    info: 'bg-surface-high text-on-surface border border-border-soft shadow-md',
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  };

  return (
    <div className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg z-50 animate-fade-in-up ${styles[type]}`}>
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
        {icons[type]}
      </span>
      <span className="font-label-md text-label-md">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
};
