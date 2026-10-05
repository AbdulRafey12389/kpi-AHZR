import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { FormField } from '../../../components/forms/FormField';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { useToast } from '../../../app/providers/ToastProvider';
import { CURRENT_KPI_MONTH } from '../../../constants/kpiConstants';

export function QuickKpiModal({ isOpen, onClose, employees = [], onSave }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    employee_id: '',
    month: CURRENT_KPI_MONTH,
    present_days: 22,
    working_days: 26,
    tasks_assigned: 15,
    tasks_completed: 13,
    on_time_delivery: 85,
    teamwork: 8,
    discipline: 8,
    communication: 8,
    suggestions_submitted: 2,
    suggestions_approved: 2,
  });

  useEffect(() => {
    if (employees.length > 0 && !formData.employee_id) {
      setFormData(prev => ({ ...prev, employee_id: employees[0].id }));
    }
  }, [employees, formData.employee_id]);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async () => {
    if (!formData.employee_id) {
      showToast('Please select an employee', 'error');
      return;
    }
    try {
      await onSave(formData);
      onClose();
    } catch {
      // Toast already shown in parent
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick KPI Entry"
      icon="fa-plus-circle"
      maxWidth="560px"
    >
      <div className="form-row fr2">
        <FormField label="Employee" icon="fa-user" required>
          <Select
            value={formData.employee_id}
            onChange={e => handleChange('employee_id', e.target.value)}
          >
            <option value="">-- Select Employee --</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>
                {e.employee_code} — {e.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Month" icon="fa-calendar" required>
          <Input
            type="month"
            value={formData.month}
            onChange={e => handleChange('month', e.target.value)}
          />
        </FormField>
      </div>

      <div className="form-row fr2">
        <FormField label="Present Days (out of 26)">
          <Input
            type="number"
            min="0"
            max="26"
            value={formData.present_days}
            onChange={e => handleChange('present_days', e.target.value)}
          />
        </FormField>

        <FormField label="Task On-Time Delivery (%)">
          <Input
            type="number"
            min="0"
            max="100"
            value={formData.on_time_delivery}
            onChange={e => handleChange('on_time_delivery', e.target.value)}
          />
        </FormField>
      </div>

      <div className="form-row fr2">
        <FormField label="Behavior Avg (1-10)">
          <Input
            type="number"
            min="1"
            max="10"
            value={formData.teamwork}
            onChange={e => {
              const val = e.target.value;
              setFormData(prev => ({
                ...prev,
                teamwork: val,
                discipline: val,
                communication: val,
              }));
            }}
          />
        </FormField>

        <FormField label="Kaizen Submissions">
          <Input
            type="number"
            min="0"
            value={formData.suggestions_submitted}
            onChange={e => {
              const val = e.target.value;
              setFormData(prev => ({
                ...prev,
                suggestions_submitted: val,
                suggestions_approved: val,
              }));
            }}
          />
        </FormField>
      </div>

      <div style={{ marginTop: '16px' }}>
        <Button
          variant="primary"
          style={{ width: '100%' }}
          icon="fa-save"
          onClick={handleSave}
        >
          Save KPI Entry
        </Button>
      </div>
    </Modal>
  );
}
