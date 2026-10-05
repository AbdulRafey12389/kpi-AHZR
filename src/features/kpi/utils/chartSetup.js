/**
 * AZHR HRMS — Chart.js Registration and Theme Utilities
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register all required Chart.js controllers and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Generates theme colors matching dark/light mode
 * @param {boolean} isDark
 */
export function getChartTheme(isDark) {
  const textColor = isDark ? '#E8F0FF' : '#0F172A';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
  const tickColor = isDark ? '#8BA0BF' : '#475569';

  return {
    color: textColor,
    grid: gridColor,
    tick: tickColor,
    font: {
      family: 'Inter, sans-serif',
      size: 10,
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: tickColor, font: { size: 10, family: 'Inter' } },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: tickColor, font: { size: 10, family: 'Inter' } },
      },
    },
    legend: {
      labels: {
        color: textColor,
        font: { size: 10, family: 'Inter' },
        boxWidth: 12,
      },
    },
  };
}
