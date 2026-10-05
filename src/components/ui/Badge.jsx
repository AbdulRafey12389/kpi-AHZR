import React from 'react';

/**
 * Reusable Badge component for performance ratings and statuses
 */
export function Badge({ children, variant = 'normal', className = '', ...props }) {
  let badgeClass = 'badge';

  switch (variant) {
    case 'xo':
      badgeClass += ' b-xo';
      break;
    case 'excellent':
      badgeClass += ' b-excellent';
      break;
    case 'good':
      badgeClass += ' b-good';
      break;
    case 'normal':
      badgeClass += ' b-normal';
      break;
    case 'bad':
      badgeClass += ' b-bad';
      break;
    case 'critical':
      badgeClass += ' b-critical';
      break;
    case 'active':
      badgeClass += ' badge-active';
      break;
    case 'inactive':
      badgeClass += ' badge-inactive';
      break;
    default:
      badgeClass += ` b-${variant}`;
  }

  return (
    <span className={`${badgeClass} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
