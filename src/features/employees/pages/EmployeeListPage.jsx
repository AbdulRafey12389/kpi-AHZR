import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';
import { EmployeeTable } from '../components/EmployeeTable';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/forms/Select';
import { Modal } from '../../../components/ui/Modal';
import { LoadingSpinner } from '../../../components/feedback/LoadingSpinner';
import { DEPARTMENTS } from '../../../constants/departments';

export function EmployeeListPage() {
  const navigate = useNavigate();
  const {
    employees,
    loading,
    filters,
    setFilters,
    removeEmployee,
    changeStatus,
  } = useEmployees();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const activeCount = employees.filter(e => e.status === 'Active').length;
  const inactiveCount = employees.filter(e => e.status === 'Inactive').length;

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleDeptChange = (e) => {
    setFilters(prev => ({ ...prev, department: e.target.value }));
  };

  const handleStatusChange = (e) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeEmployee(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // Error handled in hook toast
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <i className="fas fa-users" style={{ color: 'var(--amber)', fontSize: '18px' }} />
        <h1>Employee Management</h1>
        <span className="ph-badge">Directory</span>
        <span className="ph-badge-gold">{employees.length} Personnel</span>

        <div className="ph-right">
          <Button
            variant="primary"
            size="sm"
            icon="fa-user-plus"
            onClick={() => navigate('/employees/new')}
          >
            Add Employee
          </Button>
        </div>
      </div>

      <div className="page-body">
        {/* Quick Stat Highlights */}
        <div className="stats-grid sg-4">
          <div className="stat-card sc-blue">
            <div className="stat-icon si-blue"><i className="fas fa-users" /></div>
            <div className="stat-num">{employees.length}</div>
            <div className="stat-label">Total Personnel</div>
          </div>
          <div className="stat-card sc-green">
            <div className="stat-icon si-green"><i className="fas fa-user-check" /></div>
            <div className="stat-num">{activeCount}</div>
            <div className="stat-label">Active Staff</div>
          </div>
          <div className="stat-card sc-red">
            <div className="stat-icon si-red"><i className="fas fa-user-slash" /></div>
            <div className="stat-num">{inactiveCount}</div>
            <div className="stat-label">Inactive Staff</div>
          </div>
          <div className="stat-card sc-purple">
            <div className="stat-icon si-purple"><i className="fas fa-building" /></div>
            <div className="stat-num">{DEPARTMENTS.length}</div>
            <div className="stat-label">Operating Units</div>
          </div>
        </div>

        {/* Master Employee Table Card */}
        <Card
          title="Personnel Directory"
          icon="fa-address-book"
          noPadding
          rightAction={
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search name, code, role..."
                value={filters.search || ''}
                onChange={handleSearchChange}
                style={{ width: '180px', fontSize: '11px', padding: '5px 8px' }}
              />
              <Select
                value={filters.department || 'all'}
                onChange={handleDeptChange}
                style={{ width: '140px', fontSize: '11px', padding: '5px 8px' }}
              >
                <option value="all">All Departments</option>
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
              <Select
                value={filters.status || 'all'}
                onChange={handleStatusChange}
                style={{ width: '110px', fontSize: '11px', padding: '5px 8px' }}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </div>
          }
        >
          {loading ? (
            <LoadingSpinner message="Loading employee directory..." />
          ) : (
            <EmployeeTable
              employees={employees}
              onDelete={emp => setDeleteTarget(emp)}
              onToggleStatus={changeStatus}
            />
          )}
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Employee Deletion"
        icon="fa-triangle-exclamation"
        maxWidth="460px"
      >
        <div style={{ padding: '8px 0' }}>
          <p style={{ fontSize: '12px', color: 'var(--text)', lineHeight: '1.6' }}>
            Are you sure you want to permanently delete{' '}
            <strong>
              {deleteTarget?.name} ({deleteTarget?.employee_code})
            </strong>
            ?
          </p>
          <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px' }}>
            This action will also remove associated KPI records and performance history. If the employee has left the company, consider setting their status to <strong>Inactive</strong> instead.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              icon="fa-trash"
              onClick={confirmDelete}
              loading={deleting}
            >
              Delete Employee
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
