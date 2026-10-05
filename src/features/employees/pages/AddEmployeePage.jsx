import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField } from '../../../components/forms/FormField';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { validateEmployee } from '../utils/employeeValidation';
import { DEPARTMENTS, DESIGNATIONS } from '../../../constants/departments';

export function AddEmployeePage() {
  const navigate = useNavigate();
  const { addEmployee, employees } = useEmployees();

  // Auto-suggest next employee code (e.g., EMP-106)
  const nextCodeNum = String(employees.length + 1).padStart(3, '0');
  const [formData, setFormData] = useState({
    employee_code: `EMP-${nextCodeNum}`,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: 'Production',
    designation: 'Technician',
    joining_date: new Date().toISOString().split('T')[0],
    status: 'Active',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateEmployee(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      await addEmployee(formData);
      navigate('/employees');
    } catch {
      // Toast already shown in hook
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <i className="fas fa-user-plus" style={{ color: 'var(--blue)', fontSize: '18px' }} />
        <h1>Add New Employee</h1>
        <span className="ph-badge">Onboarding</span>
        <div className="ph-right">
          <Button variant="outline" size="sm" onClick={() => navigate('/employees')}>
            Cancel
          </Button>
        </div>
      </div>

      <div className="page-body" style={{ maxWidth: '880px', margin: '0 auto' }}>
        <Card title="Personnel Registration Form" icon="fa-id-card">
          <form onSubmit={handleSubmit}>
            {/* Identity Information */}
            <div className="sec-title">
              <i className="fas fa-user" /> Identity &amp; Identification
            </div>
            <div className="form-row fr3">
              <FormField
                label="Employee Code"
                icon="fa-hashtag"
                required
                error={errors.employee_code}
                helperText="Unique organizational ID"
              >
                <Input
                  type="text"
                  placeholder="EMP-106"
                  value={formData.employee_code}
                  onChange={e => handleChange('employee_code', e.target.value)}
                />
              </FormField>

              <FormField
                label="First Name"
                icon="fa-user"
                required
                error={errors.first_name}
              >
                <Input
                  type="text"
                  placeholder="e.g. Tariq"
                  value={formData.first_name}
                  onChange={e => handleChange('first_name', e.target.value)}
                />
              </FormField>

              <FormField
                label="Last Name"
                icon="fa-user"
                required
                error={errors.last_name}
              >
                <Input
                  type="text"
                  placeholder="e.g. Mehmood"
                  value={formData.last_name}
                  onChange={e => handleChange('last_name', e.target.value)}
                />
              </FormField>
            </div>

            {/* Contact Information */}
            <div className="sec-title" style={{ marginTop: '16px' }}>
              <i className="fas fa-envelope" /> Contact Information
            </div>
            <div className="form-row fr2">
              <FormField
                label="Official Email"
                icon="fa-envelope"
                required
                error={errors.email}
              >
                <Input
                  type="email"
                  placeholder="tariq.mehmood@azhr.com"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                />
              </FormField>

              <FormField
                label="Phone Number"
                icon="fa-phone"
                required
                error={errors.phone}
              >
                <Input
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={formData.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                />
              </FormField>
            </div>

            {/* Employment Details */}
            <div className="sec-title" style={{ marginTop: '16px' }}>
              <i className="fas fa-briefcase" /> Organizational Assignment
            </div>
            <div className="form-row fr3">
              <FormField
                label="Department"
                icon="fa-building"
                required
                error={errors.department}
              >
                <Select
                  value={formData.department}
                  onChange={e => handleChange('department', e.target.value)}
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Designation"
                icon="fa-user-tie"
                required
                error={errors.designation}
              >
                <Select
                  value={formData.designation}
                  onChange={e => handleChange('designation', e.target.value)}
                >
                  {DESIGNATIONS.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Joining Date"
                icon="fa-calendar"
                required
                error={errors.joining_date}
              >
                <Input
                  type="date"
                  value={formData.joining_date}
                  onChange={e => handleChange('joining_date', e.target.value)}
                />
              </FormField>
            </div>

            <div className="form-row fr2" style={{ marginTop: '8px' }}>
              <FormField label="Employment Status" icon="fa-toggle-on">
                <Select
                  value={formData.status}
                  onChange={e => handleChange('status', e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </FormField>
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)',
              }}
            >
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate('/employees')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                icon="fa-user-check"
                loading={submitting}
              >
                Save &amp; Add Employee
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
