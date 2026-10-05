import React from 'react';

/**
 * Reusable Input component
 */
export function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  readOnly = false,
  disabled = false,
  error = false,
  className = '',
  min,
  max,
  step,
  ...props
}) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      className={`${error ? 'input-error' : ''} ${className}`.trim()}
      style={error ? { borderColor: 'var(--red2)' } : undefined}
      {...props}
    />
  );
}
