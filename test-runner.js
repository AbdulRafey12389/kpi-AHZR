/**
 * Automated Verification Script for KPI Business Rules & Form Validations
 */

import {
  calculateAttendanceScore,
  calculateTaskScore,
  calculateBehaviorScore,
  calculateKaizenScore,
  calculateTotalScore,
  getKpiRating,
} from './src/features/kpi/utils/kpiCalculations.js';

import { validateKpiEntry } from './src/features/kpi/utils/kpiValidation.js';
import { validateEmployee } from './src/features/employees/utils/employeeValidation.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n--- 1. KPI Calculation Tests ---');

// Attendance
const att1 = calculateAttendanceScore({ workingDays: 26, presentDays: 26, lateArrivals: 0 });
assert(att1 === 100, `Full attendance should be 100 (got ${att1})`);

const attZero = calculateAttendanceScore({ workingDays: 0, presentDays: 5, lateArrivals: 0 });
assert(attZero === 0, `Zero working days should safely return 0 without error (got ${attZero})`);

const attLateCap = calculateAttendanceScore({ workingDays: 26, presentDays: 26, lateArrivals: 20 });
// 20 * 0.5 = 10, capped at max 5 deduction -> 100 - 5 = 95
assert(attLateCap === 95, `Late deduction capping at 5% (got ${attLateCap})`);

// Task
const task1 = calculateTaskScore({ tasksAssigned: 20, tasksCompleted: 16, onTimeDeliveryPct: 90 });
assert(task1 === 72, `Task score: (16/20)*90 = 72 (got ${task1})`);

const taskZero = calculateTaskScore({ tasksAssigned: 0, tasksCompleted: 5, onTimeDeliveryPct: 100 });
assert(taskZero === 0, `Zero tasks assigned safely returns 0 (got ${taskZero})`);

// Behavior
const beh1 = calculateBehaviorScore({ teamwork: 8, discipline: 7, communication: 9 });
assert(beh1 === 80, `Behavior score: (24/30)*100 = 80 (got ${beh1})`);

// Kaizen
const kai1 = calculateKaizenScore({ suggestionsSubmitted: 5, suggestionsApproved: 4 });
assert(kai1 === 80, `Kaizen score: (4/5)*100 = 80 (got ${kai1})`);

const kaiZero = calculateKaizenScore({ suggestionsSubmitted: 0, suggestionsApproved: 0 });
assert(kaiZero === 0, `Zero kaizen submissions safely returns 0 (got ${kaiZero})`);

// Total Score
const total1 = calculateTotalScore({ attScore: 80, taskScore: 70, behScore: 80, kaiScore: 90 });
// 80*0.3 + 70*0.4 + 80*0.2 + 90*0.1 = 24 + 28 + 16 + 9 = 77
assert(total1 === 77, `Weighted total score: (80*30%)+(70*40%)+(80*20%)+(90*10%) = 77 (got ${total1})`);

// Ratings
const rXO = getKpiRating(97);
assert(rXO.key === 'xo', `Score 97 is Extra Ordinary (got ${rXO.label})`);

const rExc = getKpiRating(88);
assert(rExc.key === 'excellent', `Score 88 is Excellent (got ${rExc.label})`);

const rGood = getKpiRating(74);
assert(rGood.key === 'good', `Score 74 is Good (got ${rGood.label})`);

const rNorm = getKpiRating(65);
assert(rNorm.key === 'normal', `Score 65 is Normal (got ${rNorm.label})`);

const rBad = getKpiRating(45);
assert(rBad.key === 'bad', `Score 45 is Bad / Critical (got ${rBad.label})`);

console.log('\n--- 2. KPI Validation Tests ---');

const kpiValid = validateKpiEntry({
  employee_id: 'emp-001',
  month: '2026-06',
  working_days: 26,
  present_days: 24,
  late_arrivals: 1,
  tasks_assigned: 10,
  tasks_completed: 9,
  on_time_delivery: 90,
  teamwork: 8,
  discipline: 8,
  communication: 8,
  suggestions_submitted: 2,
  suggestions_approved: 2,
});
assert(kpiValid.isValid === true, 'Valid KPI entry passes validation');

const kpiInvalid = validateKpiEntry({
  employee_id: '',
  month: 'invalid-month',
  working_days: 26,
  present_days: 30, // Exceeds working days!
  tasks_assigned: 5,
  tasks_completed: 10, // Exceeds assigned!
});
assert(kpiInvalid.isValid === false, 'Invalid KPI entry rejected');
assert(kpiInvalid.errors.employee_id !== undefined, 'Caught missing employee_id');
assert(kpiInvalid.errors.present_days !== undefined, 'Caught present_days > working_days');
assert(kpiInvalid.errors.tasks_completed !== undefined, 'Caught tasks_completed > tasks_assigned');

console.log('\n--- 3. Employee Validation Tests ---');

const empValid = validateEmployee({
  employee_code: 'EMP-106',
  first_name: 'Tariq',
  last_name: 'Mehmood',
  email: 'tariq.mehmood@azhr.com',
  phone: '+92 300 1234567',
  department: 'Production',
  designation: 'Technician',
  joining_date: '2026-06-01',
  status: 'Active',
});
assert(empValid.isValid === true, 'Valid employee registration passes validation');

const empInvalid = validateEmployee({
  employee_code: '',
  first_name: 'A', // Too short
  last_name: '',
  email: 'not-an-email',
  phone: '',
  department: 'InvalidDept',
  designation: '',
  joining_date: '',
});
assert(empInvalid.isValid === false, 'Invalid employee registration rejected');
assert(empInvalid.errors.first_name !== undefined, 'Caught first_name too short');
assert(empInvalid.errors.email !== undefined, 'Caught invalid email');
assert(empInvalid.errors.department !== undefined, 'Caught invalid department');

console.log(`\n========================================`);
console.log(`Tests Finished: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
