/**
 * AZHR HRMS — KPI Business Calculations Engine
 * 
 * Strict business formulas preserved from AZHR Standard prototype:
 * - Attendance Score = ((Present Days / Working Days) * 100) - (Late Arrivals * deduction)
 * - Task Score       = (Tasks Completed / Tasks Assigned) * On-Time Delivery %
 * - Behavior Score   = ((Teamwork + Discipline + Communication) / 30) * 100
 * - Kaizen Score     = (Approved Suggestions / Submitted Suggestions) * 100
 * - Total Score      = (Attendance * W_att) + (Task * W_task) + (Behavior * W_beh) + (Kaizen * W_kai)
 */

import { DEFAULT_KPI_WEIGHTS, DEFAULT_DEDUCTION_POLICY, KPI_RATING_TIERS } from '../../../constants/kpiConstants.js';

/**
 * Calculates Attendance Score (0 - 100)
 * Safely handles zero working days, late arrival deduction capping, and bounds checking.
 * 
 * @param {Object} params
 * @param {number|string} params.workingDays - Total working days in month (default 26)
 * @param {number|string} params.presentDays - Days employee was present
 * @param {number|string} [params.lateArrivals=0] - Number of late arrivals
 * @param {number} [params.deductPerLate=0.5] - Deduction per late arrival
 * @param {number} [params.maxLateDeduction=5] - Maximum total deduction for late arrivals
 * @returns {number} Integer score between 0 and 100
 */
export function calculateAttendanceScore({
  workingDays = 26,
  presentDays = 0,
  lateArrivals = 0,
  deductPerLate = DEFAULT_DEDUCTION_POLICY.deductPerLate,
  maxLateDeduction = DEFAULT_DEDUCTION_POLICY.maxLateDeduction,
} = {}) {
  const wDays = Number(workingDays) || 0;
  const pDays = Math.max(0, Number(presentDays) || 0);
  const lates = Math.max(0, Number(lateArrivals) || 0);

  // Guard against division by zero
  if (wDays <= 0) return 0;

  // Base attendance percentage, clamped so present days cannot exceed working days
  const validPresentDays = Math.min(pDays, wDays);
  const baseRate = (validPresentDays / wDays) * 100;

  // Late arrival penalty with max cap
  const rawLateDeduction = lates * (Number(deductPerLate) || 0);
  const cappedLateDeduction = Math.min(rawLateDeduction, Number(maxLateDeduction) || 5);

  const rawScore = baseRate - cappedLateDeduction;
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

/**
 * Calculates Task Score (0 - 100)
 * Ratio of completed tasks to assigned tasks multiplied by on-time delivery rate.
 * 
 * @param {Object} params
 * @param {number|string} params.tasksAssigned - Total tasks assigned
 * @param {number|string} params.tasksCompleted - Tasks completed
 * @param {number|string} params.onTimeDeliveryPct - On-time delivery percentage (0-100)
 * @returns {number} Integer score between 0 and 100
 */
export function calculateTaskScore({
  tasksAssigned = 0,
  tasksCompleted = 0,
  onTimeDeliveryPct = 0,
} = {}) {
  const assigned = Number(tasksAssigned) || 0;
  const completed = Math.max(0, Number(tasksCompleted) || 0);
  const onTime = Math.max(0, Math.min(100, Number(onTimeDeliveryPct) || 0));

  // Guard against division by zero
  if (assigned <= 0) return 0;

  // Completed tasks cannot exceed assigned tasks for ratio
  const validCompleted = Math.min(completed, assigned);
  const completionRatio = validCompleted / assigned;

  // Task score = (Done / Assigned) * onTime%
  const rawScore = completionRatio * onTime;
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

/**
 * Calculates Behavior Score (0 - 100)
 * Evaluates Teamwork, Discipline, and Communication (each rated 1 to 10, total out of 30).
 * 
 * @param {Object} params
 * @param {number|string} params.teamwork - Rating 1-10
 * @param {number|string} params.discipline - Rating 1-10
 * @param {number|string} params.communication - Rating 1-10
 * @returns {number} Integer score between 0 and 100
 */
export function calculateBehaviorScore({
  teamwork = 0,
  discipline = 0,
  communication = 0,
} = {}) {
  const team = Math.max(0, Math.min(10, Number(teamwork) || 0));
  const disc = Math.max(0, Math.min(10, Number(discipline) || 0));
  const comm = Math.max(0, Math.min(10, Number(communication) || 0));

  const totalPoints = team + disc + comm;
  const rawScore = (totalPoints / 30) * 100;
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

/**
 * Calculates Kaizen / Continuous Improvement Score (0 - 100)
 * Ratio of approved suggestions to submitted suggestions.
 * 
 * @param {Object} params
 * @param {number|string} params.suggestionsSubmitted - Total suggestions submitted
 * @param {number|string} params.suggestionsApproved - Suggestions approved
 * @returns {number} Integer score between 0 and 100
 */
export function calculateKaizenScore({
  suggestionsSubmitted = 0,
  suggestionsApproved = 0,
} = {}) {
  const submitted = Number(suggestionsSubmitted) || 0;
  const approved = Math.max(0, Number(suggestionsApproved) || 0);

  if (submitted <= 0) return 0;

  const validApproved = Math.min(approved, submitted);
  const rawScore = (validApproved / submitted) * 100;
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

/**
 * Calculates Weighted Total KPI Score (0 - 100)
 * Total Score = (Att * W_att) + (Task * W_task) + (Beh * W_beh) + (Kai * W_kai)
 * 
 * @param {Object} componentScores
 * @param {number} componentScores.attScore
 * @param {number} componentScores.taskScore
 * @param {number} componentScores.behScore
 * @param {number} componentScores.kaiScore
 * @param {Object} [weights=DEFAULT_KPI_WEIGHTS]
 * @returns {number} Integer score between 0 and 100
 */
export function calculateTotalScore(
  { attScore = 0, taskScore = 0, behScore = 0, kaiScore = 0 } = {},
  weights = DEFAULT_KPI_WEIGHTS
) {
  const wAtt = (Number(weights.attendance) || 30) / 100;
  const wTask = (Number(weights.task) || 40) / 100;
  const wBeh = (Number(weights.behavior) || 20) / 100;
  const wKai = (Number(weights.kaizen) || 10) / 100;

  const sAtt = Math.max(0, Math.min(100, Number(attScore) || 0));
  const sTask = Math.max(0, Math.min(100, Number(taskScore) || 0));
  const sBeh = Math.max(0, Math.min(100, Number(behScore) || 0));
  const sKai = Math.max(0, Math.min(100, Number(kaiScore) || 0));

  const total = (sAtt * wAtt) + (sTask * wTask) + (sBeh * wBeh) + (sKai * wKai);
  return Math.max(0, Math.min(100, Math.round(total)));
}

/**
 * Retrieves performance rating object based on score
 * 95-100: Extra Ordinary
 * 85-94: Excellent
 * 70-84: Good
 * 60-69: Normal
 * <60: Bad / Critical
 * 
 * @param {number} score
 * @returns {Object} Rating tier config
 */
export function getKpiRating(score) {
  const numScore = Number(score) || 0;
  for (const tier of KPI_RATING_TIERS) {
    if (numScore >= tier.min && numScore <= tier.max) {
      return tier;
    }
  }
  return KPI_RATING_TIERS[KPI_RATING_TIERS.length - 1]; // Default to critical
}

/**
 * Returns color hex for a given score matching prototype
 * @param {number} score
 * @returns {string} Hex color
 */
export function getBarColor(score) {
  const s = Number(score) || 0;
  if (s >= 85) return '#34D399'; // green2
  if (s >= 70) return '#3B82F6'; // blue
  if (s >= 60) return '#FBBF24'; // amber2
  return '#F87171';              // red2
}

/**
 * Generates dynamic SWOT insights for an employee based on their KPI component breakdown
 * 
 * @param {Object} kpiRecord
 * @returns {Object} { strengths, weaknesses, opportunities, threats }
 */
export function generateSwotAnalysis(kpiRecord) {
  if (!kpiRecord) {
    return { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  }

  const { attScore = 0, taskScore = 0, behScore = 0, kaiScore = 0, total = 0 } = kpiRecord;
  const strengths = [];
  const weaknesses = [];
  const opportunities = [];
  const threats = [];

  // Strengths
  if (attScore >= 85) strengths.push('Excellent attendance record — reliable team member with minimal downtime');
  if (taskScore >= 85) strengths.push('High task completion rate with consistent on-time delivery adherence');
  if (behScore >= 85) strengths.push('Strong teamwork, disciplined conduct, and proactive communication skills');
  if (kaiScore >= 70) strengths.push('Active contributor in Kaizen / Continuous Improvement ideation');
  if (total >= 85) strengths.push('Consistently above-average overall organizational performance');

  // Weaknesses
  if (attScore < 70) weaknesses.push('Attendance needs improvement — frequent absences or late arrivals recorded');
  if (taskScore < 70) weaknesses.push('Task completion or on-time delivery rate is below organizational expectations');
  if (behScore < 70) weaknesses.push('Behavioral scores indicate peer friction, communication gaps, or discipline issues');
  if (kaiScore < 50) weaknesses.push('Low Kaizen participation — needs active engagement with continuous improvement culture');
  if (strengths.length === 0) weaknesses.push('Overall baseline performance is below standard KPI thresholds');

  // Opportunities
  opportunities.push('Targeted training opportunities in technical and process automation skills');
  opportunities.push('Structured mentorship program to bridge specific component performance gaps');
  if (total >= 70) opportunities.push('Eligible candidate for leadership track or promotion review in next cycle');
  opportunities.push('Cross-departmental project involvement for broader operational exposure');

  // Threats
  if (attScore < 70) threats.push('Risk of payroll deductions or attendance reprimands due to attendance deficit');
  if (total < 60) threats.push('Performance Improvement Plan (PIP) may be triggered under standard HR policy');
  threats.push('Potential negative impact on annual increment and bonus allocations if unaddressed');
  if (kaiScore < 50) threats.push('Risk of stagnation within the company innovation and lean culture');

  return { strengths, weaknesses, opportunities, threats };
}
