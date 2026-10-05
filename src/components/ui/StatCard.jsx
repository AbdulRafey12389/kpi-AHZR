import React from 'react';

/**
 * Reusable Stat Card matching prototype cards
 * Variants: blue, green, gold, amber, purple, red
 */
export function StatCard({
  icon,
  number,
  label,
  subText,
  subType = 'up', // 'up' | 'dn'
  variant = 'blue',
  className = '',
  onClick,
}) {
  return (
    <div
      className={`stat-card sc-${variant} ${className}`.trim()}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className={`stat-icon si-${variant}`}>
        {icon && <i className={`fas ${icon}`} />}
      </div>
      <div className="stat-num">{number}</div>
      <div className="stat-label">{label}</div>
      {subText && (
        <div className={`stat-sub sub-${subType}`}>
          <i className={`fas fa-arrow-${subType === 'up' ? 'trend-up' : 'trend-down'}`} />
          <span>{subText}</span>
        </div>
      )}
    </div>
  );
}
