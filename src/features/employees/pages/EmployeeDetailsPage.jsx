import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById, toggleEmployeeStatus } from '../services/employeeService';
import { getKpiByEmployee } from '../../kpi/services/kpiService';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { LoadingSpinner } from '../../../components/feedback/LoadingSpinner';
import { getBarColor } from '../../kpi/utils/kpiCalculations';
import { useToast } from '../../../app/providers/ToastProvider';

export function EmployeeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [employee, setEmployee] = useState(null);
  const [kpiRecord, setKpiRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const emp = await getEmployeeById(id);
        setEmployee(emp);
        const kpi = await getKpiByEmployee(emp.id || emp.employee_code);
        setKpiRecord(kpi);
      } catch (err) {
        showToast(err.message || 'Error loading employee', 'error');
        navigate('/employees');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, navigate, showToast]);

  const handleToggleStatus = async () => {
    if (!employee) return;
    const newStatus = employee.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const updated = await toggleEmployeeStatus(employee.id, newStatus);
      setEmployee(updated);
      showToast(`Employee status updated to ${newStatus}`, 'info');
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  if (loading || !employee) {
    return <LoadingSpinner message="Loading employee profile..." />;
  }

  const isActive = employee.status === 'Active';
  const initials = (
    (employee.first_name?.[0] || '') + (employee.last_name?.[0] || employee.name?.[0] || '')
  ).toUpperCase() || 'EM';

  const kpiColor = kpiRecord ? getBarColor(kpiRecord.total) : '#3B82F6';
  const r = kpiRecord?.ratingObj || { label: kpiRecord?.rating || 'Normal', cls: 'rating-norm' };

  return (
    <>
      <div className="page-header">
        <i className="fas fa-id-card" style={{ color: 'var(--blue)', fontSize: '18px' }} />
        <h1>{employee.name}</h1>
        <span className="ph-badge">{employee.employee_code}</span>
        <Badge variant={isActive ? 'active' : 'inactive'}>{employee.status}</Badge>

        <div className="ph-right">
          <Button
            variant="outline"
            size="sm"
            icon="fa-arrow-left"
            onClick={() => navigate('/employees')}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon="fa-pen"
            onClick={() => navigate(`/employees/${id}/edit`)}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="page-body">
        {/* Profile Card Header */}
        <div className="emp-profile-header">
          <div className="emp-profile-avatar">{initials}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>
              {employee.name}
            </h2>
            <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '12px' }}>
              <span>
                <i className="fas fa-briefcase" style={{ marginRight: '4px', color: 'var(--blue)' }} />
                {employee.designation}
              </span>
              <span>
                <i className="fas fa-building" style={{ marginRight: '4px', color: 'var(--amber2)' }} />
                {employee.department}
              </span>
              <span>
                <i className="fas fa-hashtag" style={{ marginRight: '4px', color: 'var(--purple2)' }} />
                {employee.employee_code}
              </span>
            </div>
          </div>
          <div>
            <Button
              variant={isActive ? 'amber' : 'success'}
              size="sm"
              icon={isActive ? 'fa-user-slash' : 'fa-user-check'}
              onClick={handleToggleStatus}
            >
              {isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="g2" style={{ marginBottom: '16px' }}>
          {/* Contact & Employment Information */}
          <Card title="Employment & Contact Information" icon="fa-circle-info">
            <div className="emp-detail-grid">
              <div className="emp-detail-item">
                <div className="emp-detail-label">Employee Code</div>
                <div className="emp-detail-value" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {employee.employee_code}
                </div>
              </div>

              <div className="emp-detail-item">
                <div className="emp-detail-label">Status</div>
                <div className="emp-detail-value">
                  <Badge variant={isActive ? 'active' : 'inactive'}>{employee.status}</Badge>
                </div>
              </div>

              <div className="emp-detail-item">
                <div className="emp-detail-label">Department</div>
                <div className="emp-detail-value">{employee.department}</div>
              </div>

              <div className="emp-detail-item">
                <div className="emp-detail-label">Designation</div>
                <div className="emp-detail-value">{employee.designation}</div>
              </div>

              <div className="emp-detail-item">
                <div className="emp-detail-label">Official Email</div>
                <div className="emp-detail-value" style={{ wordBreak: 'break-all', fontSize: '12px' }}>
                  {employee.email}
                </div>
              </div>

              <div className="emp-detail-item">
                <div className="emp-detail-label">Phone Number</div>
                <div className="emp-detail-value">{employee.phone}</div>
              </div>

              <div className="emp-detail-item">
                <div className="emp-detail-label">Joining Date</div>
                <div className="emp-detail-value">{employee.joining_date}</div>
              </div>

              <div className="emp-detail-item">
                <div className="emp-detail-label">Record ID</div>
                <div
                  className="emp-detail-value"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--muted)' }}
                >
                  {employee.id}
                </div>
              </div>
            </div>
          </Card>

          {/* Current KPI Performance Overview */}
          <Card
            title="M06 — KPI Scorecard (June 2026)"
            icon="fa-chart-line"
            rightAction={
              kpiRecord && (
                <Button
                  variant="outline"
                  size="sm"
                  icon="fa-wand-magic-sparkles"
                  onClick={() => navigate(`/kpi/swot?emp=${employee.employee_code}`)}
                >
                  View SWOT
                </Button>
              )
            }
          >
            {kpiRecord ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ textAlign: 'center', minWidth: '90px' }}>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '38px',
                        fontWeight: 700,
                        color: kpiColor,
                      }}
                    >
                      {kpiRecord.total}%
                    </div>
                    <span className={r.cls}>{r.label}</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {/* Attendance */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '2px' }}>
                          <span style={{ color: 'var(--muted)' }}>Attendance Score (30%)</span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{kpiRecord.attScore}%</span>
                        </div>
                        <ProgressBar percentage={kpiRecord.attScore} color="#3B82F6" />
                      </div>

                      {/* Task */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '2px' }}>
                          <span style={{ color: 'var(--muted)' }}>Task Score (40%)</span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{kpiRecord.taskScore}%</span>
                        </div>
                        <ProgressBar percentage={kpiRecord.taskScore} color="#34D399" />
                      </div>

                      {/* Behavior */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '2px' }}>
                          <span style={{ color: 'var(--muted)' }}>Behavior Score (20%)</span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{kpiRecord.behScore}%</span>
                        </div>
                        <ProgressBar percentage={kpiRecord.behScore} color="#A78BFA" />
                      </div>

                      {/* Kaizen */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '2px' }}>
                          <span style={{ color: 'var(--muted)' }}>Kaizen / CI Score (10%)</span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{kpiRecord.kaiScore}%</span>
                        </div>
                        <ProgressBar percentage={kpiRecord.kaiScore} color="#FBBF24" />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--surface2)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>
                    Present: <b>{kpiRecord.present_days}</b> / {kpiRecord.working_days} days
                  </span>
                  <span>
                    Lates: <b>{kpiRecord.late_arrivals}</b>
                  </span>
                  <span>
                    Tasks Done: <b>{kpiRecord.tasks_completed}</b> / {kpiRecord.tasks_assigned}
                  </span>
                  <span>
                    Kaizen Ideas: <b>{kpiRecord.suggestions_approved}</b>
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                <i className="fas fa-chart-line" style={{ fontSize: '28px', marginBottom: '8px', opacity: 0.5 }} />
                <p style={{ fontSize: '12px' }}>No KPI entry recorded for this employee for June 2026.</p>
                <Button
                  variant="primary"
                  size="sm"
                  style={{ marginTop: '12px' }}
                  onClick={() => navigate('/kpi/entry')}
                >
                  Record KPI Now
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
