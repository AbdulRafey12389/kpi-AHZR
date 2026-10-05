/**
 * AZHR HRMS — KPI Service
 * 
 * Handles all database operations for KPI records and settings.
 * Supports Supabase when configured with fallback to mock data layer.
 */

import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import {
  getMockKpiEntries,
  saveMockKpis,
  getMockKpiSettings,
  saveMockKpiSettings,
  getMockEmployees,
} from '../../../lib/mockData';
import {
  calculateAttendanceScore,
  calculateTaskScore,
  calculateBehaviorScore,
  calculateKaizenScore,
  calculateTotalScore,
  getKpiRating,
} from '../utils/kpiCalculations';
import { CURRENT_KPI_MONTH } from '../../../constants/kpiConstants';

/**
 * Fetches KPI entries matching filter criteria
 * @param {Object} [filters]
 * @param {string} [filters.month]
 * @param {string} [filters.department]
 * @param {string} [filters.employeeId]
 * @param {string} [filters.search]
 * @returns {Promise<Array>}
 */
export async function getKpiEntries(filters = {}) {
  const month = filters.month || CURRENT_KPI_MONTH;

  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('kpi_entries')
        .select(`
          *,
          employees:employee_id (
            id, employee_code, first_name, last_name, department, designation
          )
        `)
        .eq('month', month);

      const { data, error } = await query;
      if (error) throw error;
      if (data && data.length > 0) {
        let mapped = data.map(normalizeKpiRecord);

        if (filters.department && filters.department !== 'all') {
          mapped = mapped.filter(k => k.dept === filters.department);
        }
        if (filters.search) {
          const s = filters.search.toLowerCase().trim();
          mapped = mapped.filter(k =>
            (k.name || '').toLowerCase().includes(s) ||
            (k.empId || '').toLowerCase().includes(s) ||
            (k.dept || '').toLowerCase().includes(s)
          );
        }
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase getKpiEntries failed, falling back to mock storage:', err.message);
    }
  }

  // Mock Fallback
  let list = getMockKpiEntries();

  if (month) {
    list = list.filter(k => k.month === month);
  }

  if (filters.department && filters.department !== 'all') {
    list = list.filter(k => k.dept === filters.department);
  }

  if (filters.employeeId) {
    list = list.filter(k => k.employee_id === filters.employeeId || k.empId === filters.employeeId);
  }

  if (filters.search) {
    const term = filters.search.toLowerCase().trim();
    list = list.filter(k => {
      const name = (k.name || '').toLowerCase();
      const code = (k.empId || '').toLowerCase();
      const dept = (k.dept || '').toLowerCase();
      return name.includes(term) || code.includes(term) || dept.includes(term);
    });
  }

  return list.map(normalizeKpiRecord);
}

/**
 * Normalizes a KPI entry from Supabase or Mock
 */
function normalizeKpiRecord(record) {
  const emp = record.employees || {};
  const name = record.name || (emp.first_name ? `${emp.first_name} ${emp.last_name}` : 'Unknown');
  const empId = record.empId || emp.employee_code || record.employee_id;
  const dept = record.dept || emp.department || 'Production';
  const desig = record.desig || emp.designation || 'Staff';

  const attScore = Number(record.attendance_score ?? record.attScore ?? 0);
  const taskScore = Number(record.task_score ?? record.taskScore ?? 0);
  const behScore = Number(record.behavior_score ?? record.behScore ?? 0);
  const kaiScore = Number(record.kaizen_score ?? record.kaiScore ?? 0);
  const total = Number(record.total_score ?? record.total ?? 0);

  const ratingObj = getKpiRating(total);

  return {
    ...record,
    id: record.id,
    employee_id: record.employee_id,
    empId,
    name,
    dept,
    desig,
    month: record.month,
    
    working_days: record.working_days ?? 26,
    present_days: record.present_days ?? 0,
    late_arrivals: record.late_arrivals ?? 0,
    attScore,
    attWt: Math.round(attScore * 0.30),
    
    tasks_assigned: record.tasks_assigned ?? 0,
    tasks_completed: record.tasks_completed ?? 0,
    on_time_delivery: record.on_time_delivery ?? 0,
    taskScore,
    taskWt: Math.round(taskScore * 0.40),
    
    teamwork: record.teamwork ?? 0,
    discipline: record.discipline ?? 0,
    communication: record.communication ?? 0,
    behScore,
    behWt: Math.round(behScore * 0.20),
    
    suggestions_submitted: record.suggestions_submitted ?? 0,
    suggestions_approved: record.suggestions_approved ?? 0,
    suggestions_implemented: record.suggestions_implemented ?? 0,
    kaiScore,
    kaiWt: Math.round(kaiScore * 0.10),
    
    total,
    rating: record.rating || ratingObj.label,
    ratingObj,
  };
}

/**
 * Fetches KPI record for a specific employee
 * @param {string} employeeId
 * @param {string} [month=CURRENT_KPI_MONTH]
 * @returns {Promise<Object|null>}
 */
export async function getKpiByEmployee(employeeId, month = CURRENT_KPI_MONTH) {
  const entries = await getKpiEntries({ month });
  return entries.find(k => k.employee_id === employeeId || k.empId === employeeId) || null;
}

/**
 * Creates or upserts a KPI record
 * @param {Object} rawData
 * @returns {Promise<Object>}
 */
export async function createKpiEntry(rawData) {
  const weights = getMockKpiSettings();

  // Compute component scores using business calculation engine
  const attScore = calculateAttendanceScore({
    workingDays: rawData.working_days,
    presentDays: rawData.present_days,
    lateArrivals: rawData.late_arrivals,
    deductPerLate: weights.deductPerLate,
    maxLateDeduction: weights.maxLateDeduction,
  });

  const taskScore = calculateTaskScore({
    tasksAssigned: rawData.tasks_assigned,
    tasksCompleted: rawData.tasks_completed,
    onTimeDeliveryPct: rawData.on_time_delivery,
  });

  const behScore = calculateBehaviorScore({
    teamwork: rawData.teamwork,
    discipline: rawData.discipline,
    communication: rawData.communication,
  });

  const kaiScore = calculateKaizenScore({
    suggestionsSubmitted: rawData.suggestions_submitted,
    suggestionsApproved: rawData.suggestions_approved,
  });

  const total = calculateTotalScore({ attScore, taskScore, behScore, kaiScore }, weights);
  const ratingObj = getKpiRating(total);

  // Lookup employee details
  const employees = getMockEmployees();
  const emp = employees.find(e => e.id === rawData.employee_id || e.employee_code === rawData.employee_id) || {};

  const record = {
    id: `kpi-${emp.id || rawData.employee_id}-${rawData.month}`,
    employee_id: emp.id || rawData.employee_id,
    empId: emp.employee_code || rawData.employee_id,
    name: emp.name || `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || 'Employee',
    dept: emp.department || rawData.dept || 'Production',
    desig: emp.designation || 'Staff',
    month: rawData.month || CURRENT_KPI_MONTH,

    working_days: Number(rawData.working_days) || 26,
    present_days: Number(rawData.present_days) || 0,
    late_arrivals: Number(rawData.late_arrivals) || 0,
    attendance_score: attScore,
    attScore,
    attWt: Math.round(attScore * (weights.attendance / 100)),

    tasks_assigned: Number(rawData.tasks_assigned) || 0,
    tasks_completed: Number(rawData.tasks_completed) || 0,
    on_time_delivery: Number(rawData.on_time_delivery) || 0,
    task_score: taskScore,
    taskScore,
    taskWt: Math.round(taskScore * (weights.task / 100)),

    teamwork: Number(rawData.teamwork) || 0,
    discipline: Number(rawData.discipline) || 0,
    communication: Number(rawData.communication) || 0,
    behavior_score: behScore,
    behScore,
    behWt: Math.round(behScore * (weights.behavior / 100)),

    suggestions_submitted: Number(rawData.suggestions_submitted) || 0,
    suggestions_approved: Number(rawData.suggestions_approved) || 0,
    suggestions_implemented: Number(rawData.suggestions_implemented) || 0,
    kaizen_score: kaiScore,
    kaiScore,
    kaiWt: Math.round(kaiScore * (weights.kaizen / 100)),

    total_score: total,
    total,
    rating: ratingObj.label,
    ratingObj,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('kpi_entries')
        .upsert([record], { onConflict: 'employee_id,month' })
        .select()
        .single();
      if (error) throw error;
      return normalizeKpiRecord(data);
    } catch (err) {
      console.warn('Supabase createKpiEntry failed, storing in mock:', err.message);
    }
  }

  // Mock store
  const list = getMockKpiEntries();
  const existingIndex = list.findIndex(k => k.employee_id === record.employee_id && k.month === record.month);
  if (existingIndex >= 0) {
    list[existingIndex] = record;
  } else {
    list.unshift(record);
  }
  saveMockKpis(list);
  return normalizeKpiRecord(record);
}

/**
 * Retrieves KPI weights and policies
 */
export async function getKpiSettings() {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('kpi_settings').select('*').eq('id', 'default').single();
      if (error) throw error;
      if (data) {
        return {
          attendance: Number(data.attendance_weight),
          task: Number(data.task_weight),
          behavior: Number(data.behavior_weight),
          kaizen: Number(data.kaizen_weight),
          deductPerLate: Number(data.deduct_per_late),
          maxLateDeduction: Number(data.max_late_deduction),
        };
      }
    } catch (err) {
      console.warn('Supabase getKpiSettings failed, using local mock:', err.message);
    }
  }
  return getMockKpiSettings();
}

/**
 * Updates KPI weights and policies
 */
export async function updateKpiSettings(settings) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('kpi_settings')
        .upsert([{
          id: 'default',
          attendance_weight: settings.attendance,
          task_weight: settings.task,
          behavior_weight: settings.behavior,
          kaizen_weight: settings.kaizen,
          deduct_per_late: settings.deductPerLate,
          max_late_deduction: settings.maxLateDeduction,
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase updateKpiSettings failed, saving to local mock:', err.message);
    }
  }
  saveMockKpiSettings(settings);
  return settings;
}
