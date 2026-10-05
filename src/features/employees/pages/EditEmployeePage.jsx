import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';
import { getEmployeeById } from '../services/employeeService';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField } from '../../../components/forms/FormField';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { LoadingSpinner } from '../../../components/feedback/LoadingSpinner';
import { validateEmployee } from '../utils/employeeValidation';
import { DEPARTMENTS, DESIGNATIONS } from '../../../constants/departments';
import { useToast } from '../../../app/providers/ToastProvider';

export function EditEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editEmployee } = useEmployees();
  const { showToast } = useToast();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchEmp() {
      try {
        const emp = await getEmployeeById(id);
        setFormData({
          employee_code: emp.employee_code,
          first_name: emp.first_name,
          last_name: emp.last_name,
          email: emp.email,
          phone: emp.phone,
          department: emp.department,
          designation: emp.designation,
          joining_date: emp.joining_date,
          status: emp.status || 'Active',
        });
      } catch (err) {
        showToast(err.message || 'Employee not found', 'error');
        navigate('/employees');
      } finally {
        setLoading(false);
      }
    }
    fetchEmp();
  }, [id, navigate, showToast]);

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
      await editEmployee(id, formData);
      navigate(`/employees/${id}`);
    } catch {
      // Toast shown in hook
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !formData) {
    return <LoadingSpinner message="Retrieving employee details..." />;
  }

  return (
    <>
      <div className="page-header">
        <i className="fas fa-user-pen" style={{ color: 'var(--blue)', fontSize: '18px' }} />
        <h1>Edit Employee — {formData.employee_code}</h1>
        <div className="ph-right">
          <Button variant="outline" size="sm" onClick={() => navigate(`/employees/${id}`)}>
            Cancel
          </Button>
        </div>
      </div>

      <div className="page-body" style={{ maxWidth: '880px', margin: '0 auto' }}>
        <Card title={`Update Record — ${formData.first_name} ${formData.last_name}`} icon="fa-id-card">
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
              >
                <Input
                  type="text"
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
                onClick={() => navigate(`/employees/${id}`)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                icon="fa-save"
                loading={submitting}
              >
                Update Employee
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
