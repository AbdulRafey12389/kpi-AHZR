/**
 * AZHR HRMS — Employee Service
 * 
 * Handles all database operations for Employees.
 * Uses Supabase when configured with fallback to mock data layer.
 */

import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { getMockEmployees, saveMockEmployees } from '../../../lib/mockData';

/**
 * Fetches all employees with optional filters
 * @param {Object} [filters]
 * @param {string} [filters.department]
 * @param {string} [filters.status]
 * @param {string} [filters.search]
 * @returns {Promise<Array>}
 */
export async function getEmployees(filters = {}) {
  // 1. Supabase Path
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('employees').select('*').order('created_at', { ascending: false });

      if (filters.department && filters.department !== 'all') {
        query = query.eq('department', filters.department);
      }

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.search) {
        const s = filters.search.trim();
        query = query.or(`first_name.ilike.%${s}%,last_name.ilike.%${s}%,employee_code.ilike.%${s}%,designation.ilike.%${s}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(normalizeEmployeeRecord);
      }
    } catch (err) {
      console.warn('Supabase getEmployees failed, falling back to mock storage:', err.message);
    }
  }

  // 2. Mock Fallback Path
  let list = getMockEmployees();

  if (filters.department && filters.department !== 'all') {
    list = list.filter(e => e.department === filters.department);
  }

  if (filters.status && filters.status !== 'all') {
    list = list.filter(e => e.status.toLowerCase() === filters.status.toLowerCase());
  }

  if (filters.search) {
    const term = filters.search.toLowerCase().trim();
    list = list.filter(e => {
      const fullName = (e.name || `${e.first_name} ${e.last_name}`).toLowerCase();
      const code = (e.employee_code || e.id).toLowerCase();
      const desig = (e.designation || '').toLowerCase();
      const email = (e.email || '').toLowerCase();
      return fullName.includes(term) || code.includes(term) || desig.includes(term) || email.includes(term);
    });
  }

  return list.map(normalizeEmployeeRecord);
}

/**
 * Normalizes an employee record to ensure consistent camelCase and snake_case properties
 */
function normalizeEmployeeRecord(emp) {
  const firstName = emp.first_name || (emp.name ? emp.name.split(' ')[0] : 'Employee');
  const lastName = emp.last_name || (emp.name ? emp.name.split(' ').slice(1).join(' ') : '');
  const fullName = emp.name || `${firstName} ${lastName}`.trim();
  const code = emp.employee_code || emp.id;

  return {
    ...emp,
    id: emp.id,
    employee_code: code,
    first_name: firstName,
    last_name: lastName,
    name: fullName,
    department: emp.department,
    designation: emp.designation,
    email: emp.email || `${firstName.toLowerCase()}@azhr.com`,
    phone: emp.phone || 'N/A',
    joining_date: emp.joining_date || '2024-01-01',
    status: emp.status || 'Active',
  };
}

/**
 * Fetches a single employee by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getEmployeeById(id) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('employees').select('*').eq('id', id).single();
      if (error) throw error;
      if (data) return normalizeEmployeeRecord(data);
    } catch (err) {
      console.warn(`Supabase getEmployeeById failed for ${id}, using mock store:`, err.message);
    }
  }

  const list = getMockEmployees();
  const found = list.find(e => e.id === id || e.employee_code === id);
  if (!found) {
    throw new Error(`Employee with ID "${id}" was not found.`);
  }
  return normalizeEmployeeRecord(found);
}

/**
 * Creates a new employee
 * @param {Object} employeeData
 * @returns {Promise<Object>}
 */
export async function createEmployee(employeeData) {
  const cleanData = {
    employee_code: employeeData.employee_code.trim().toUpperCase(),
    first_name: employeeData.first_name.trim(),
    last_name: employeeData.last_name.trim(),
    email: employeeData.email.trim().toLowerCase(),
    phone: (employeeData.phone || '').trim(),
    department: employeeData.department.trim(),
    designation: employeeData.designation.trim(),
    joining_date: employeeData.joining_date,
    status: employeeData.status || 'Active',
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('employees').insert([cleanData]).select().single();
      if (error) throw error;
      return normalizeEmployeeRecord(data);
    } catch (err) {
      console.warn('Supabase createEmployee failed, saving to mock storage:', err.message);
    }
  }

  // Mock store
  const list = getMockEmployees();
  // Check code uniqueness
  const exists = list.some(e => (e.employee_code || '').toUpperCase() === cleanData.employee_code);
  if (exists) {
    throw new Error(`Employee code "${cleanData.employee_code}" is already in use.`);
  }

  const newId = `emp-${Date.now().toString().slice(-4)}`;
  const newEmp = {
    id: newId,
    ...cleanData,
    name: `${cleanData.first_name} ${cleanData.last_name}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  list.unshift(newEmp);
  saveMockEmployees(list);
  return normalizeEmployeeRecord(newEmp);
}

/**
 * Updates an existing employee
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export async function updateEmployee(id, updates) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return normalizeEmployeeRecord(data);
    } catch (err) {
      console.warn(`Supabase updateEmployee failed for ${id}, updating mock store:`, err.message);
    }
  }

  const list = getMockEmployees();
  const index = list.findIndex(e => e.id === id || e.employee_code === id);
  if (index === -1) {
    throw new Error(`Employee "${id}" not found.`);
  }

  const updated = {
    ...list[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  if (updates.first_name || updates.last_name) {
    updated.name = `${updated.first_name} ${updated.last_name}`;
  }

  list[index] = updated;
  saveMockEmployees(list);
  return normalizeEmployeeRecord(updated);
}

/**
 * Deletes an employee
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deleteEmployee(id) {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn(`Supabase deleteEmployee failed for ${id}, deleting from mock store:`, err.message);
    }
  }

  const list = getMockEmployees();
  const filtered = list.filter(e => e.id !== id && e.employee_code !== id);
  saveMockEmployees(filtered);
  return true;
}

/**
 * Toggles status (Active <-> Inactive)
 * @param {string} id
 * @param {string} newStatus
 * @returns {Promise<Object>}
 */
export async function toggleEmployeeStatus(id, newStatus) {
  return updateEmployee(id, { status: newStatus });
}
