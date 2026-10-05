/**
 * AZHR HRMS — KPI Constants & Default Configurations
 */

export const DEFAULT_KPI_WEIGHTS = {
  attendance: 30, // 30%
  task: 40,       // 40%
  behavior: 20,   // 20%
  kaizen: 10,     // 10%
};

export const DEFAULT_DEDUCTION_POLICY = {
  deductPerLate: 0.5,    // Points deducted per late arrival
  maxLateDeduction: 5,   // Maximum late arrival penalty (%)
};

export const KPI_RATING_TIERS = [
  {
    min: 95,
    max: 100,
    key: 'xo',
    label: '⭐ Extra Ordinary',
    cls: 'rating-xo',
    badgeCls: 'b-xo',
    color: '#D4A843',
  },
  {
    min: 85,
    max: 94.99,
    key: 'excellent',
    label: 'Excellent',
    cls: 'rating-exc',
    badgeCls: 'b-good',
    color: '#34D399',
  },
  {
    min: 70,
    max: 84.99,
    key: 'good',
    label: 'Good',
    cls: 'rating-good',
    badgeCls: 'b-normal',
    color: '#3B82F6',
  },
  {
    min: 60,
    max: 69.99,
    key: 'normal',
    label: 'Normal',
    cls: 'rating-norm',
    badgeCls: 'b-bad',
    color: '#FBBF24',
  },
  {
    min: 0,
    max: 59.99,
    key: 'bad',
    label: 'Bad / Critical',
    cls: 'rating-bad',
    badgeCls: 'b-critical',
    color: '#F87171',
  },
];

export const CURRENT_KPI_MONTH = '2026-06';
export const CURRENT_KPI_PERIOD_LABEL = 'June 2026';
