import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useKpiData } from '../hooks/useKpiData';
import { useEmployees } from '../../employees/hooks/useEmployees';
import { QuickKpiModal } from './QuickKpiModal';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/forms/Select';
import { DEPARTMENTS } from '../../../constants/departments';
import { CURRENT_KPI_PERIOD_LABEL } from '../../../constants/kpiConstants';
import { useToast } from '../../../app/providers/ToastProvider';

export function KpiLayout() {
  const location = useLocation();
  const { showToast } = useToast();
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);

  const kpiDataState = useKpiData();
  const { employees } = useEmployees();

  const handleDeptFilter = (dept) => {
    kpiDataState.setFilters(prev => ({ ...prev, department: dept }));
    showToast(dept === 'all' ? 'All departments selected' : `Filtered to ${dept}`, 'info');
  };

  const handleExport = () => {
    showToast('Exporting KPI Summary Report...', 'info');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Active tab helper
  const isTabActive = (path) => {
    if (path === '/kpi' || path === '/kpi/dashboard') {
      return location.pathname === '/kpi' || location.pathname === '/kpi/dashboard';
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* PAGE HEADER */}
      <div className="page-header">
        <i className="fas fa-chart-line" style={{ color: 'var(--blue)', fontSize: '18px' }} />
        <h1>KPI &amp; Progress</h1>
        <span className="ph-badge">
          <i className="fas fa-circle" style={{ fontSize: '6px', color: 'var(--green2)' }} /> Live
        </span>
        <span className="ph-badge-gold">{CURRENT_KPI_PERIOD_LABEL}</span>

        <div className="ph-right">
          <Select
            value={kpiDataState.filters.department}
            onChange={e => handleDeptFilter(e.target.value)}
            style={{ fontSize: '11px', padding: '5px 10px', width: '160px' }}
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>

          <Button
            variant="outline"
            size="sm"
            icon="fa-download"
            onClick={handleExport}
          >
            Export
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon="fa-plus"
            onClick={() => setIsQuickModalOpen(true)}
          >
            Add KPI Entry
          </Button>
        </div>
      </div>

      {/* MODULE TABS */}
      <div className="mod-tabs">
        <NavLink
          to="/kpi/dashboard"
          className={`mtab ${isTabActive('/kpi') ? 'active' : ''}`}
        >
          <i className="fas fa-chart-pie" /> Dashboard
        </NavLink>

        <NavLink
          to="/kpi/entry"
          className={`mtab ${isTabActive('/kpi/entry') ? 'active' : ''}`}
        >
          <i className="fas fa-pen-to-square" /> KPI Entry
        </NavLink>

        <NavLink
          to="/kpi/employees"
          className={`mtab ${isTabActive('/kpi/employees') ? 'active' : ''}`}
        >
          <i className="fas fa-users-viewfinder" /> Employee KPIs
        </NavLink>

        <NavLink
          to="/kpi/departments"
          className={`mtab ${isTabActive('/kpi/departments') ? 'active' : ''}`}
        >
          <i className="fas fa-building" /> Dept Performance
        </NavLink>

        <NavLink
          to="/kpi/swot"
          className={`mtab ${isTabActive('/kpi/swot') ? 'active' : ''}`}
        >
          <i className="fas fa-chart-simple" /> SWOT / YY Analysis
        </NavLink>

        <NavLink
          to="/kpi/formula"
          className={`mtab ${isTabActive('/kpi/formula') ? 'active' : ''}`}
        >
          <i className="fas fa-calculator" /> Formula &amp; Weights
        </NavLink>
      </div>

      {/* PAGE BODY */}
      <div className="page-body">
        <Outlet context={{ kpiDataState, employees }} />
      </div>

      {/* Quick KPI Entry Modal */}
      <QuickKpiModal
        isOpen={isQuickModalOpen}
        onClose={() => setIsQuickModalOpen(false)}
        employees={employees}
        onSave={kpiDataState.recordKpi}
      />
    </>
  );
}
