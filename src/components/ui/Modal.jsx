import React, { useEffect } from 'react';

/**
 * Reusable Modal overlay component
 */
export function Modal({
  isOpen,
  onClose,
  title,
  icon = 'fa-circle-info',
  children,
  maxWidth = '640px',
}) {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-ov"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal" style={{ maxWidth }}>
        <div className="modal-hdr">
          {icon && <i className={`fas ${icon}`} style={{ color: 'var(--blue)', fontSize: '18px' }} />}
          <h3>{title}</h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
