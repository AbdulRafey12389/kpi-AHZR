import React from 'react';

/**
 * Reusable Progress Bar matching the prototype's exact styles
 * @param {Object} props
 * @param {number} props.percentage - 0 to 100
 * @param {string} [props.color] - Fill color hex or CSS variable
 * @param {string} [props.minWidth='80px']
 * @param {string} [props.height='6px']
 */
export function ProgressBar({
  percentage = 0,
  color = '#3B82F6',
  minWidth = '80px',
  height = '6px',
  className = '',
}) {
  const clamped = Math.max(0, Math.min(100, Number(percentage) || 0));

  return (
    <div
      className={`prog-bar ${className}`.trim()}
      style={{ minWidth, height }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="prog-fill"
        style={{
          width: `${clamped}%`,
          background: color,
        }}
      />
    </div>
  );
}
