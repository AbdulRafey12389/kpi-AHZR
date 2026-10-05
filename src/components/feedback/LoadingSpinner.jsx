import React from 'react';

export function LoadingSpinner({ message = 'Loading data...', size = 'md' }) {
  const iconSize = size === 'sm' ? '18px' : size === 'lg' ? '36px' : '26px';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        color: 'var(--muted)',
        gap: '12px',
      }}
    >
      <i
        className="fas fa-circle-notch fa-spin"
        style={{ fontSize: iconSize, color: 'var(--blue)' }}
      />
      <span style={{ fontSize: '12px' }}>{message}</span>
    </div>
  );
}
