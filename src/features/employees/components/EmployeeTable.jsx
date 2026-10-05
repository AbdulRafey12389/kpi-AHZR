import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/feedback/EmptyState';

export function EmployeeTable({
  employees = [],
  onDelete,
  onToggleStatus,
}) {
  const navigate = useNavigate();

  if (employees.length === 0) {
    return (
      <EmptyState
        icon="fa-users-slash"
        title="No employees found"
        description="Try adjusting your search criteria or add a new employee."
      />
    );
  }

  return (
    <div className="table-wrap">
      <table className="kpi-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Employee</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Contact</th>
            <th>Joined</th>
            <th>Status</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => {
            const isActive = emp.status === 'Active';
            const initials = (
              (emp.first_name?.[0] || '') + (emp.last_name?.[0] || emp.name?.[0] || '')
            ).toUpperCase() || 'EM';

            return (
              <tr key={emp.id}>
                {/* Code */}
                <td
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    color: 'var(--muted)',
                  }}
                >
                  {emp.employee_code}
                </td>

                {/* Employee Avatar & Name */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg,#1D4ED8,#7C3AED)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>
                    <div>
                      <strong>{emp.name || `${emp.first_name} ${emp.last_name}`}</strong>
                    </div>
                  </div>
                </td>

                {/* Department */}
                <td>{emp.department}</td>

                {/* Designation */}
                <td>{emp.designation}</td>

                {/* Contact */}
                <td>
                  <div style={{ fontSize: '11px' }}>{emp.email}</div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{emp.phone}</div>
                </td>

                {/* Joined */}
                <td style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  {emp.joining_date}
                </td>

                {/* Status */}
                <td>
                  <Badge variant={isActive ? 'active' : 'inactive'}>
                    <i
                      className="fas fa-circle"
                      style={{
                        fontSize: '6px',
                        color: isActive ? 'var(--green2)' : 'var(--red2)',
                        marginRight: '3px',
                      }}
                    />
                    {emp.status}
                  </Badge>
                </td>

                {/* Actions */}
                <td>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    {/* View Profile */}
                    <button
                      type="button"
                      className="btn btn-outline btn-sm btn-icon"
                      onClick={() => navigate(`/employees/${emp.id}`)}
                      title="View Details"
                    >
                      <i className="fas fa-eye" />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      className="btn btn-outline btn-sm btn-icon"
                      onClick={() => navigate(`/employees/${emp.id}/edit`)}
                      title="Edit Employee"
                    >
                      <i className="fas fa-pen" />
                    </button>

                    {/* Toggle Status */}
                    <button
                      type="button"
                      className="btn btn-outline btn-sm btn-icon"
                      onClick={() =>
                        onToggleStatus &&
                        onToggleStatus(emp.id, isActive ? 'Inactive' : 'Active')
                      }
                      title={isActive ? 'Deactivate' : 'Activate'}
                    >
                      <i
                        className={`fas ${isActive ? 'fa-user-slash' : 'fa-user-check'}`}
                        style={{ color: isActive ? 'var(--amber2)' : 'var(--green2)' }}
                      />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      className="btn btn-outline btn-sm btn-icon"
                      onClick={() => onDelete && onDelete(emp)}
                      title="Delete Employee"
                    >
                      <i className="fas fa-trash" style={{ color: 'var(--red2)' }} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
