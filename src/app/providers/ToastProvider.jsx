/**
 * AZHR HRMS — Toast Notification Provider
 * 
 * Reusable toast notification system rendered at fixed top-right.
 * Styled matching the original prototype HTML.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3200) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 6);
    const newToast = { id, message, type };

    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const getIconClass = type => {
    switch (type) {
      case 'success':
        return 'fa-circle-check';
      case 'error':
        return 'fa-circle-xmark';
      case 'info':
      default:
        return 'fa-circle-info';
    }
  };

  const getIconColor = type => {
    switch (type) {
      case 'success':
        return 'var(--green2)';
      case 'error':
        return 'var(--red2)';
      case 'info':
      default:
        return 'var(--blue)';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-wrap" id="toastWrap" aria-live="polite">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast ${toast.type}`}
            onClick={() => removeToast(toast.id)}
            style={{ cursor: 'pointer' }}
          >
            <i
              className={`fas ${getIconClass(toast.type)}`}
              style={{ color: getIconColor(toast.type) }}
            />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
