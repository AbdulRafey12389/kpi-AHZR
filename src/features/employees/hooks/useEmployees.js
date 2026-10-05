import { useState, useEffect, useCallback } from 'react';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
} from '../services/employeeService';
import { useToast } from '../../../app/providers/ToastProvider';

export function useEmployees(initialFilters = {}) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const { showToast } = useToast();

  const loadEmployees = useCallback(async (currentFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEmployees(currentFilters);
      setEmployees(data);
    } catch (err) {
      setError(err.message || 'Failed to load employees');
      showToast(err.message || 'Failed to load employees', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    loadEmployees(filters);
  }, [loadEmployees, filters]);

  const addEmployee = async (employeeData) => {
    try {
      const created = await createEmployee(employeeData);
      setEmployees(prev => [created, ...prev]);
      showToast(`Employee ${created.name} (${created.employee_code}) created successfully`, 'success');
      return created;
    } catch (err) {
      showToast(err.message || 'Error creating employee', 'error');
      throw err;
    }
  };

  const editEmployee = async (id, updates) => {
    try {
      const updated = await updateEmployee(id, updates);
      setEmployees(prev => prev.map(e => (e.id === id ? updated : e)));
      showToast(`Employee ${updated.name} updated successfully`, 'success');
      return updated;
    } catch (err) {
      showToast(err.message || 'Error updating employee', 'error');
      throw err;
    }
  };

  const removeEmployee = async (id) => {
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
      showToast('Employee deleted successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Error deleting employee', 'error');
      throw err;
    }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      const updated = await toggleEmployeeStatus(id, newStatus);
      setEmployees(prev => prev.map(e => (e.id === id ? updated : e)));
      showToast(`Status changed to ${newStatus}`, 'info');
      return updated;
    } catch (err) {
      showToast(err.message || 'Error updating status', 'error');
      throw err;
    }
  };

  return {
    employees,
    loading,
    error,
    filters,
    setFilters,
    reload: loadEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,
    changeStatus,
  };
}
