import React from 'react';

/**
 * Reusable Button component
 * @param {Object} props
 * @param {'primary' | 'success' | 'gold' | 'amber' | 'danger' | 'purple' | 'outline'} [props.variant='primary']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {string} [props.icon] - FontAwesome icon class, e.g. "fa-plus"
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) {
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : '';

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <i className="fas fa-spinner fa-spin" />
      ) : icon ? (
        <i className={`fas ${icon}`} />
      ) : null}
      {children}
    </button>
  );
}
