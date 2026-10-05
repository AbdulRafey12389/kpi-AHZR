import React from 'react';

/**
 * Reusable Select component
 */
export function Select({
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  error = false,
  className = '',
  children,
  ...props
}) {
  return (
    <select
      value={value ?? ''}
      onChange={onChange}
      disabled={disabled}
      className={`${error ? 'input-error' : ''} ${className}`.trim()}
      style={error ? { borderColor: 'var(--red2)' } : undefined}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.length > 0
        ? options.map(opt => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const label = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {label}
              </option>
            );
          })
        : children}
    </select>
  );
}
