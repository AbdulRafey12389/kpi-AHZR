import React from 'react';

export function EmptyState({
  icon = 'fa-folder-open',
  title = 'No records found',
  description = 'Try adjusting your search criteria or filters.',
  action,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        color: 'var(--muted)',
      }}
    >
      <i
        className={`fas ${icon}`}
        style={{ fontSize: '38px', marginBottom: '14px', opacity: 0.6 }}
      />
      <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
        {title}
      </h4>
      {description && (
        <p style={{ fontSize: '11px', maxWidth: '320px', marginBottom: action ? '16px' : '0' }}>
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
