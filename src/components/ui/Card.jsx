import React from 'react';

/**
 * Reusable Card component matching AZHR HRMS design system
 */
export function Card({
  title,
  icon,
  rightAction,
  children,
  className = '',
  bodyStyle = {},
  noPadding = false,
  ...props
}) {
  return (
    <div className={`card ${className}`.trim()} {...props}>
      {title && (
        <div className="card-header">
          {icon && <i className={`fas ${icon}`} />}
          <span>{title}</span>
          {rightAction && <div className="ch-right">{rightAction}</div>}
        </div>
      )}
      <div
        className="card-body"
        style={{
          padding: noPadding ? '0' : undefined,
          ...bodyStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
