import React from 'react';

/**
 * Reusable Form Field wrapper with label, icon, and error message
 */
export function FormField({
  label,
  icon,
  required = false,
  error,
  children,
  className = '',
  helperText,
}) {
  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label>
          {icon && <i className={`fas ${icon}`} />}
          {label}
          {required && <span style={{ color: 'var(--red2)', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      {children}
      {error && <span className="form-error">{error}</span>}
      {helperText && !error && (
        <span style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>
          {helperText}
        </span>
      )}
    </div>
  );
}
