/**
 * AZHR HRMS — Mock & Reference Data Layer
 * 
 * Provides fallback mock data seeded from the original 105 employee prototype
 * when Supabase credentials are not yet configured.
 * Persists changes to localStorage so demo interactions (Add, Edit, Delete, KPI entry)
 * survive page refreshes.
 */

import { DEPARTMENTS, DESIGNATIONS, EMPLOYEE_STATUSES } from '../constants/departments';
import { calculateTotalScore, getKpiRating } from '../features/kpi/utils/kpiCalculations';
import { DEFAULT_KPI_WEIGHTS, CURRENT_KPI_MONTH } from '../constants/kpiConstants';

const EMP_NAMES = [
  'Hamza Khan', 'Bilal Malik', 'Usman Ahmed', 'Saad Ali', 'Zain Hussain',
  'Omar Raza', 'Hassan Butt', 'Ahmed Gill', 'Fahad Sheikh', 'Imran Mirza',
  'Danish Abbasi', 'Shahzeb Ch', 'Mohsin Khan', 'Rizwan Malik', 'Tariq Ahmed',
  'Naveed Ali', 'Sajid Hussain', 'Kashif Raza', 'Waseem Butt', 'Adnan Gill',
  'Shoaib Sheikh', 'Asim Mirza', 'Faisal Abbasi', 'Junaid Ch', 'Kamran Khan',
  'Nadeem Malik', 'Qaiser Ahmed', 'Rashid Ali', 'Shafiq Hussain', 'Tanveer Raza',
  'Umar Butt', 'Waqar Gill', 'Yasir Sheikh', 'Zafar Mirza', 'Adeel Abbasi',
  'Farhan Ch', 'Gulzar Khan', 'Hammad Malik', 'Ijaz Ahmed', 'Javed Ali',
  'Salman Hussain', 'Irfan Raza', 'Shakir Butt', 'Haris Gill', 'Noman Sheikh',
  'Rehan Mirza', 'Ali Abbasi', 'Malik Ch', 'Sohail Khan', 'Arif Malik',
  'Pervaiz Ahmed', 'Murad Ali', 'Sajjad Hussain', 'Raees Raza', 'Zubair Butt',
  'Tahir Gill', 'Nasir Sheikh', 'Tauseef Mirza', 'Arshad Abbasi', 'Qayyum Ch',
  'Rana Khan', 'Akmal Malik', 'Khalid Ahmed', 'Tariq Ali', 'Amjad Hussain',
  'Bashir Raza', 'Maqsood Butt', 'Naeem Gill', 'Iftikhar Sheikh', 'Ghulam Mirza',
  'Rehman Abbasi', 'Azhar Ch', 'Mukhtar Khan', 'Shaukat Malik', 'Lateef Ahmed',
  'Zeeshan Ali', 'Farhad Hussain', 'Fiaz Raza', 'Manzoor Butt', 'Sikandar Gill',
  'Nadeem Sheikh', 'Ishfaq Mirza', 'Daniyal Abbasi', 'Furqan Ch', 'Haris Khan',
  'Owais Malik', 'Raza Ahmed', 'Anwar Ali', 'Attiq Hussain', 'Habib Raza',
  'Jamshed Butt', 'Kamal Gill', 'Liaqat Sheikh', 'Mubarak Mirza', 'Naseer Abbasi',
  'Osman Ch', 'Qasim Khan', 'Ramzan Malik', 'Sabir Ahmed', 'Toqeer Ali',
  'Umair Hussain', 'Vaqas Raza', 'Waleed Butt', 'Yousaf Sheikh', 'Zain Mirza',
  'Babar Khan'
];

/**
 * Seed initial 105 demo employees
 */
function createInitialEmployees() {
  return EMP_NAMES.map((name, i) => {
    const codeNum = String(i + 1).padStart(3, '0');
    const id = `emp-${codeNum}`;
    const employee_code = `EMP-${codeNum}`;
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ') || 'Employee';
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z]/g, '')}@azhr.com`;
    const department = DEPARTMENTS[i % DEPARTMENTS.length];
    const designation = DESIGNATIONS[i % DESIGNATIONS.length];
    const status = i === 12 || i === 45 || i === 78 ? EMPLOYEE_STATUSES.INACTIVE : EMPLOYEE_STATUSES.ACTIVE;
    
    const year = 2022 + (i % 4);
    const month = String((i % 12) + 1).padStart(2, '0');
    const day = String((i % 28) + 1).padStart(2, '0');
    const joining_date = `${year}-${month}-${day}`;

    return {
      id,
      employee_code,
      first_name: firstName,
      last_name: lastName,
      name,
      email,
      phone: `+92 300 ${String(1000000 + i * 8371).slice(0, 7)}`,
      department,
      designation,
      joining_date,
      status,
      created_at: new Date(2026, 0, 1 + i).toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
}

/**
 * Deterministic pseudo-random number generator for consistent demo data
 */
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/**
 * Seed initial KPI records for current month
 */
function createInitialKpiRecords(employeesList) {
  return employeesList.map((emp, i) => {
    const seed = i * 42 + 7;
    // Component scores
    const attScore = Math.round(70 + seededRandom(seed) * 30);
    const taskScore = Math.round(60 + seededRandom(seed + 1) * 40);
    const behScore = Math.round(65 + seededRandom(seed + 2) * 35);
    const kaiScore = Math.round(40 + seededRandom(seed + 3) * 60);

    const total = calculateTotalScore({ attScore, taskScore, behScore, kaiScore }, DEFAULT_KPI_WEIGHTS);
    const ratingObj = getKpiRating(total);

    // Realistic underlying metrics
    const working_days = 26;
    const present_days = Math.min(26, Math.max(18, Math.round((attScore / 100) * working_days)));
    const late_arrivals = Math.max(0, Math.round((100 - attScore) / 10));

    const tasks_assigned = Math.round(15 + seededRandom(seed + 4) * 20);
    const tasks_completed = Math.round((taskScore / 100) * tasks_assigned);
    const on_time_delivery = Math.min(100, Math.round(80 + seededRandom(seed + 5) * 20));

    const teamwork = Math.min(10, Math.max(6, Math.round((behScore / 100) * 10)));
    const discipline = Math.min(10, Math.max(6, Math.round(((behScore - 2) / 100) * 10)));
    const communication = Math.min(10, Math.max(6, Math.round(((behScore + 2) / 100) * 10)));

    const suggestions_submitted = Math.round(2 + seededRandom(seed + 6) * 6);
    const suggestions_approved = Math.round((kaiScore / 100) * suggestions_submitted);
    const suggestions_implemented = Math.max(0, suggestions_approved - 1);

    return {
      id: `kpi-${emp.id}-${CURRENT_KPI_MONTH}`,
      employee_id: emp.id,
      empId: emp.employee_code,
      name: emp.name || `${emp.first_name} ${emp.last_name}`,
      dept: emp.department,
      desig: emp.designation,
      month: CURRENT_KPI_MONTH,
      
      working_days,
      present_days,
      late_arrivals,
      attScore,
      attWt: Math.round(attScore * 0.30),
      
      tasks_assigned,
      tasks_completed,
      on_time_delivery,
      taskScore,
      taskWt: Math.round(taskScore * 0.40),
      
      teamwork,
      discipline,
      communication,
      behScore,
      behWt: Math.round(behScore * 0.20),
      
      suggestions_submitted,
      suggestions_approved,
      suggestions_implemented,
      kaiScore,
      kaiWt: Math.round(kaiScore * 0.10),
      
      total,
      rating: ratingObj.label,
      ratingObj,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
}

const STORAGE_KEY_EMPLOYEES = 'azhr_mock_employees_v1';
const STORAGE_KEY_KPIS = 'azhr_mock_kpis_v1';
const STORAGE_KEY_SETTINGS = 'azhr_mock_settings_v1';

/**
 * Loads mock employees from localStorage or defaults
 */
export function getMockEmployees() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_EMPLOYEES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Could not read mock employees from localStorage', e);
  }
  const initial = createInitialEmployees();
  saveMockEmployees(initial);
  return initial;
}

export function saveMockEmployees(employees) {
  try {
    localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(employees));
  } catch (e) {
    console.warn('Could not write mock employees to localStorage', e);
  }
}

/**
 * Loads mock KPI entries from localStorage or defaults
 */
export function getMockKpiEntries() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_KPIS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Could not read mock KPIs from localStorage', e);
  }
  const emps = getMockEmployees();
  const initial = createInitialKpiRecords(emps);
  saveMockKpis(initial);
  return initial;
}

export function saveMockKpis(kpiRecords) {
  try {
    localStorage.setItem(STORAGE_KEY_KPIS, JSON.stringify(kpiRecords));
  } catch (e) {
    console.warn('Could not write mock KPIs to localStorage', e);
  }
}

/**
 * Loads KPI Weights & Deduction Settings
 */
export function getMockKpiSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Could not read mock settings from localStorage', e);
  }
  const defaults = {
    attendance: 30,
    task: 40,
    behavior: 20,
    kaizen: 10,
    deductPerLate: 0.5,
    maxLateDeduction: 5,
  };
  saveMockKpiSettings(defaults);
  return defaults;
}

export function saveMockKpiSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Could not write mock settings to localStorage', e);
  }
}
