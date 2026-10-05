import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField } from '../../../components/forms/FormField';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { useKpiCalculator } from '../hooks/useKpiCalculator';
import { validateKpiEntry } from '../utils/kpiValidation';
import { CURRENT_KPI_MONTH } from '../../../constants/kpiConstants';

const INITIAL_FORM = {
  employee_id: '',
  month: CURRENT_KPI_MONTH,
  dept: '',
  working_days: 26,
  present_days: '',
  late_arrivals: '',
  tasks_assigned: '',
  tasks_completed: '',
  on_time_delivery: '',
  teamwork: '',
  discipline: '',
  communication: '',
  suggestions_submitted: '',
  suggestions_approved: '',
  suggestions_implemented: '',
};

export function KpiEntryPage() {
  const { kpiDataState, employees } = useOutletContext();
  const navigate = useNavigate();
  const { recordKpi, settings } = kpiDataState;

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Live real-time calculated scores
  const calculated = useKpiCalculator(formData, settings);

  // When employee is selected, auto fill department
  const handleEmployeeChange = (e) => {
    const selectedId = e.target.value;
    const emp = employees.find(empItem => empItem.id === selectedId || empItem.employee_code === selectedId);
    setFormData(prev => ({
      ...prev,
      employee_id: selectedId,
      dept: emp ? emp.department : '',
    }));
    if (formErrors.employee_id) {
      setFormErrors(prev => ({ ...prev, employee_id: undefined }));
    }
  };

  const handleFieldChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    const validation = validateKpiEntry(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setSaving(true);
    try {
      await recordKpi(formData);
      // Keep employee selected or clear numbers
      setFormErrors({});
    } catch {
      // Handled in recordKpi toast
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setFormData(INITIAL_FORM);
    setFormErrors({});
  };

  const handlePreviewCard = () => {
    if (!formData.employee_id) {
      setFormErrors(prev => ({ ...prev, employee_id: 'Please select an employee first' }));
      return;
    }
    navigate(`/kpi/swot?emp=${formData.employee_id}`);
  };

  return (
    <Card title="Monthly KPI Data Entry" icon="fa-pen-to-square">
      <form onSubmit={handleSave}>
        {/* Top selectors */}
        <div className="form-row fr3">
          <FormField label="Employee" icon="fa-user" required error={formErrors.employee_id}>
            <Select
              value={formData.employee_id}
              onChange={handleEmployeeChange}
              placeholder="-- Select Employee --"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.employee_code} — {emp.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Month" icon="fa-calendar" required error={formErrors.month}>
            <Input
              type="month"
              value={formData.month}
              onChange={e => handleFieldChange('month', e.target.value)}
            />
          </FormField>

          <FormField label="Department" icon="fa-building">
            <Input
              type="text"
              readOnly
              value={formData.dept}
              placeholder="Auto-populated"
            />
          </FormField>
        </div>

        {/* 1. ATTENDANCE KPI (30%) */}
        <div className="sec-title">
          <i className="fas fa-calendar-check" />
          Attendance Score (Weight: {settings.attendance}%)
        </div>
        <div className="form-row fr4">
          <FormField label="Working Days" error={formErrors.working_days}>
            <Input
              type="number"
              min="1"
              max="31"
              value={formData.working_days}
              onChange={e => handleFieldChange('working_days', e.target.value)}
            />
          </FormField>

          <FormField label="Present Days" error={formErrors.present_days}>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={formData.present_days}
              onChange={e => handleFieldChange('present_days', e.target.value)}
            />
          </FormField>

          <FormField label="Late Arrivals" error={formErrors.late_arrivals}>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={formData.late_arrivals}
              onChange={e => handleFieldChange('late_arrivals', e.target.value)}
            />
          </FormField>

          <FormField label="Att. Score (Auto)">
            <Input
              type="number"
              readOnly
              value={calculated.attScore}
              style={{ color: 'var(--blue)', fontWeight: 700 }}
            />
          </FormField>
        </div>

        {/* 2. TASK KPI (40%) */}
        <div className="sec-title">
          <i className="fas fa-list-check" />
          Task Completion Score (Weight: {settings.task}%)
        </div>
        <div className="form-row fr4">
          <FormField label="Tasks Assigned" error={formErrors.tasks_assigned}>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={formData.tasks_assigned}
              onChange={e => handleFieldChange('tasks_assigned', e.target.value)}
            />
          </FormField>

          <FormField label="Tasks Completed" error={formErrors.tasks_completed}>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={formData.tasks_completed}
              onChange={e => handleFieldChange('tasks_completed', e.target.value)}
            />
          </FormField>

          <FormField label="On-Time Delivery %" error={formErrors.on_time_delivery}>
            <Input
              type="number"
              min="0"
              max="100"
              placeholder="0"
              value={formData.on_time_delivery}
              onChange={e => handleFieldChange('on_time_delivery', e.target.value)}
            />
          </FormField>

          <FormField label="Task Score (Auto)">
            <Input
              type="number"
              readOnly
              value={calculated.taskScore}
              style={{ color: 'var(--green2)', fontWeight: 700 }}
            />
          </FormField>
        </div>

        {/* 3. BEHAVIOR KPI (20%) */}
        <div className="sec-title">
          <i className="fas fa-handshake" />
          Behavior &amp; Conduct Score (Weight: {settings.behavior}%)
        </div>
        <div className="form-row fr4">
          <FormField label="Teamwork (1-10)" error={formErrors.teamwork}>
            <Input
              type="number"
              min="1"
              max="10"
              placeholder="0"
              value={formData.teamwork}
              onChange={e => handleFieldChange('teamwork', e.target.value)}
            />
          </FormField>

          <FormField label="Discipline (1-10)" error={formErrors.discipline}>
            <Input
              type="number"
              min="1"
              max="10"
              placeholder="0"
              value={formData.discipline}
              onChange={e => handleFieldChange('discipline', e.target.value)}
            />
          </FormField>

          <FormField label="Communication (1-10)" error={formErrors.communication}>
            <Input
              type="number"
              min="1"
              max="10"
              placeholder="0"
              value={formData.communication}
              onChange={e => handleFieldChange('communication', e.target.value)}
            />
          </FormField>

          <FormField label="Behavior Score (Auto)">
            <Input
              type="number"
              readOnly
              value={calculated.behScore}
              style={{ color: 'var(--purple2)', fontWeight: 700 }}
            />
          </FormField>
        </div>

        {/* 4. KAIZEN KPI (10%) */}
        <div className="sec-title">
          <i className="fas fa-lightbulb" />
          Kaizen / CI Score (Weight: {settings.kaizen}%)
        </div>
        <div className="form-row fr4">
          <FormField label="Suggestions Submitted" error={formErrors.suggestions_submitted}>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={formData.suggestions_submitted}
              onChange={e => handleFieldChange('suggestions_submitted', e.target.value)}
            />
          </FormField>

          <FormField label="Suggestions Approved" error={formErrors.suggestions_approved}>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={formData.suggestions_approved}
              onChange={e => handleFieldChange('suggestions_approved', e.target.value)}
            />
          </FormField>

          <FormField label="Implemented">
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={formData.suggestions_implemented}
              onChange={e => handleFieldChange('suggestions_implemented', e.target.value)}
            />
          </FormField>

          <FormField label="Kaizen Score (Auto)">
            <Input
              type="number"
              readOnly
              value={calculated.kaiScore}
              style={{ color: 'var(--amber2)', fontWeight: 700 }}
            />
          </FormField>
        </div>

        {/* LIVE RESULT DISPLAY */}
        <div
          style={{
            background: 'var(--surface2)',
            borderRadius: '10px',
            padding: '16px',
            marginTop: '8px',
          }}
        >
          <div className="sec-title" style={{ border: 'none', marginBottom: '12px' }}>
            <i className="fas fa-calculator" /> Live KPI Result Preview
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            {/* ATT */}
            <div
              style={{
                textAlign: 'center',
                padding: '10px',
                background: 'var(--card-bg)',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '9px', color: 'var(--muted)', marginBottom: '4px' }}>
                ATT ({settings.attendance}%)
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '18px',
                  color: 'var(--blue)',
                  fontWeight: 700,
                }}
              >
                {calculated.attWeighted}
              </div>
            </div>

            {/* TASK */}
            <div
              style={{
                textAlign: 'center',
                padding: '10px',
                background: 'var(--card-bg)',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '9px', color: 'var(--muted)', marginBottom: '4px' }}>
                TASK ({settings.task}%)
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '18px',
                  color: 'var(--green2)',
                  fontWeight: 700,
                }}
              >
                {calculated.taskWeighted}
              </div>
            </div>

            {/* BEHAV */}
            <div
              style={{
                textAlign: 'center',
                padding: '10px',
                background: 'var(--card-bg)',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '9px', color: 'var(--muted)', marginBottom: '4px' }}>
                BEHAV ({settings.behavior}%)
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '18px',
                  color: 'var(--purple2)',
                  fontWeight: 700,
                }}
              >
                {calculated.behWeighted}
              </div>
            </div>

            {/* KAIZEN */}
            <div
              style={{
                textAlign: 'center',
                padding: '10px',
                background: 'var(--card-bg)',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '9px', color: 'var(--muted)', marginBottom: '4px' }}>
                KAIZEN ({settings.kaizen}%)
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '18px',
                  color: 'var(--amber2)',
                  fontWeight: 700,
                }}
              >
                {calculated.kaiWeighted}
              </div>
            </div>

            {/* TOTAL SCORE */}
            <div
              style={{
                textAlign: 'center',
                padding: '10px',
                background: 'linear-gradient(135deg, var(--blue2), var(--purple))',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                TOTAL SCORE
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '22px',
                  color: '#fff',
                  fontWeight: 700,
                }}
              >
                {calculated.totalScore}%
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>
                {calculated.ratingObj.label}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            <Button
              type="submit"
              variant="primary"
              icon="fa-save"
              loading={saving}
            >
              Save KPI
            </Button>
            <Button
              type="button"
              variant="gold"
              size="sm"
              icon="fa-eye"
              onClick={handlePreviewCard}
            >
              Preview Card
            </Button>
            <Button
              type="button"
              variant="outline"
              icon="fa-times"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
