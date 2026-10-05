import { useMemo } from 'react';
import {
  calculateAttendanceScore,
  calculateTaskScore,
  calculateBehaviorScore,
  calculateKaizenScore,
  calculateTotalScore,
  getKpiRating,
  getBarColor,
} from '../utils/kpiCalculations';
import { DEFAULT_KPI_WEIGHTS } from '../../../constants/kpiConstants';

/**
 * Custom hook to calculate real-time live KPI results as form values change
 */
export function useKpiCalculator(formValues, weights = DEFAULT_KPI_WEIGHTS) {
  return useMemo(() => {
    // 1. Attendance
    const attScore = calculateAttendanceScore({
      workingDays: formValues.working_days ?? 26,
      presentDays: formValues.present_days ?? 0,
      lateArrivals: formValues.late_arrivals ?? 0,
      deductPerLate: weights.deductPerLate,
      maxLateDeduction: weights.maxLateDeduction,
    });
    const attWeighted = Math.round(attScore * ((Number(weights.attendance) || 30) / 100));

    // 2. Task
    const taskScore = calculateTaskScore({
      tasksAssigned: formValues.tasks_assigned ?? 0,
      tasksCompleted: formValues.tasks_completed ?? 0,
      onTimeDeliveryPct: formValues.on_time_delivery ?? 0,
    });
    const taskWeighted = Math.round(taskScore * ((Number(weights.task) || 40) / 100));

    // 3. Behavior
    const behScore = calculateBehaviorScore({
      teamwork: formValues.teamwork ?? 0,
      discipline: formValues.discipline ?? 0,
      communication: formValues.communication ?? 0,
    });
    const behWeighted = Math.round(behScore * ((Number(weights.behavior) || 20) / 100));

    // 4. Kaizen
    const kaiScore = calculateKaizenScore({
      suggestionsSubmitted: formValues.suggestions_submitted ?? 0,
      suggestionsApproved: formValues.suggestions_approved ?? 0,
    });
    const kaiWeighted = Math.round(kaiScore * ((Number(weights.kaizen) || 10) / 100));

    // 5. Total
    const totalScore = calculateTotalScore(
      { attScore, taskScore, behScore, kaiScore },
      weights
    );
    const ratingObj = getKpiRating(totalScore);
    const barColor = getBarColor(totalScore);

    return {
      attScore,
      attWeighted,
      taskScore,
      taskWeighted,
      behScore,
      behWeighted,
      kaiScore,
      kaiWeighted,
      totalScore,
      ratingObj,
      barColor,
    };
  }, [formValues, weights]);
}
