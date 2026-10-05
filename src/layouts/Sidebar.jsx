import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ComingSoonModal } from '../components/feedback/ComingSoonModal';

export function Sidebar() {
  const location = useLocation();
  const [comingSoonModule, setComingSoonModule] = useState(null);

  const handleFutureModule = (moduleName) => {
    setComingSoonModule(moduleName);
  };

  const isKpiActive = location.pathname.startsWith('/kpi');
  const isEmployeesActive = location.pathname.startsWith('/employees');
  const isDashboardActive = location.pathname === '/' || location.pathname === '/dashboard';

  return (
    <>
      <aside className="sidebar">
        {/* Brand Logo Header */}
        <NavLink to="/kpi" className="sb-logo">
          <div className="sb-hex">
            AZ<span>HR</span>
          </div>
          <div className="sb-brand">
            <div className="sb-brand-name">
              AZ<em>HR</em>
            </div>
            <div className="sb-brand-sub">SMART HRMS</div>
            <div className="sb-brand-tag">AI Powered · Takhleeq 2026</div>
          </div>
        </NavLink>

        {/* Navigation Menus */}
        <div className="sb-nav">
          {/* Main Section */}
          <div className="sb-section">Main</div>
          <NavLink
            to="/kpi"
            className={`sb-item ${isDashboardActive ? 'active' : ''}`}
          >
            <i className="fas fa-gauge-high" />
            <span>Dashboard</span>
            <span className="sb-badge blue">L1</span>
          </NavLink>

          <NavLink
            to="/employees"
            className={`sb-item ${isEmployeesActive ? 'active' : ''}`}
          >
            <i className="fas fa-users" />
            <span>Employees</span>
            <span className="sb-badge amber">M02</span>
          </NavLink>

          <button
            type="button"
            className="sb-item disabled"
            onClick={() => handleFutureModule('Task Management')}
          >
            <i className="fas fa-list-check" />
            <span>Tasks</span>
            <span className="sb-badge blue">248</span>
          </button>

          <button
            type="button"
            className="sb-item disabled"
            onClick={() => handleFutureModule('Attendance Management')}
          >
            <i className="fas fa-calendar-check" />
            <span>Attendance</span>
          </button>

          <button
            type="button"
            className="sb-item disabled"
            onClick={() => handleFutureModule('Payroll & Compensation')}
          >
            <i className="fas fa-rupee-sign" />
            <span>Payroll</span>
          </button>

          {/* Performance Section */}
          <div className="sb-section">Performance</div>
          <NavLink
            to="/kpi"
            className={`sb-item ${isKpiActive ? 'active' : ''}`}
          >
            <i className="fas fa-chart-line" />
            <span>KPI &amp; Progress</span>
          </NavLink>

          <button
            type="button"
            className="sb-item disabled"
            onClick={() => handleFutureModule('Kaizen / Continuous Improvement')}
          >
            <i className="fas fa-lightbulb" />
            <span>Kaizen / CI</span>
            <span className="sb-badge green">12</span>
          </button>

          <button
            type="button"
            className="sb-item disabled"
            onClick={() => handleFutureModule('Risk Management')}
          >
            <i className="fas fa-triangle-exclamation" />
            <span>Risk Mgmt</span>
            <span className="sb-badge red">3</span>
          </button>

          <button
            type="button"
            className="sb-item disabled"
            onClick={() => handleFutureModule('Appeals & Grievances')}
          >
            <i className="fas fa-comment-dots" />
            <span>Appeals</span>
          </button>

          {/* Recruitment Section */}
          <div className="sb-section">Recruitment</div>
          <button
            type="button"
            className="sb-item disabled"
            onClick={() => handleFutureModule('ATS Recruitment Pipeline')}
          >
            <i className="fas fa-user-plus" />
            <span>ATS Pipeline</span>
          </button>

          <button
            type="button"
            className="sb-item disabled"
            onClick={() => handleFutureModule('Job Descriptions Library')}
          >
            <i className="fas fa-file-lines" />
            <span>Job Descriptions</span>
          </button>

          {/* AI Suite Section */}
          <div className="sb-section">AI Suite</div>
          <button
            type="button"
            className="sb-item disabled"
            onClick={() => handleFutureModule('AZHR AI Assistant & Agent')}
          >
            <i className="fas fa-robot" />
            <span>AI Agent</span>
            <span className="sb-badge purple">BETA</span>
          </button>

          <button
            type="button"
            className="sb-item disabled"
            onClick={() => handleFutureModule('Employee Surveys')}
          >
            <i className="fas fa-poll" />
            <span>Surveys</span>
          </button>

          <button
            type="button"
            className="sb-item disabled"
            onClick={() => handleFutureModule('Analytical Reports')}
          >
            <i className="fas fa-chart-bar" />
            <span>Reports</span>
          </button>

          {/* System Section */}
          <div className="sb-section">System</div>
          <button
            type="button"
            className="sb-item disabled"
            onClick={() => handleFutureModule('Admin Security Panel')}
          >
            <i className="fas fa-shield-halved" />
            <span>Admin Panel</span>
          </button>

          <button
            type="button"
            className="sb-item disabled"
            onClick={() => handleFutureModule('Global System Settings')}
          >
            <i className="fas fa-gear" />
            <span>Settings</span>
          </button>
        </div>

        {/* Build Progress Tracker */}
        <div className="sb-progress">
          <div className="sb-progress-title">Build Progress</div>
          <div className="sb-prog-item">
            <div className="sb-prog-label">
              <span>Employee Module</span>
              <span style={{ color: '#34D399' }}>100%</span>
            </div>
            <div className="sb-prog-bar">
              <div
                className="sb-prog-fill"
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg,#059669,#34D399)',
                }}
              />
            </div>
          </div>
          <div className="sb-prog-item">
            <div className="sb-prog-label">
              <span>M06 KPI &amp; Progress</span>
              <span style={{ color: '#34D399' }}>100%</span>
            </div>
            <div className="sb-prog-bar">
              <div
                className="sb-prog-fill"
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg,#1D4ED8,#3B82F6)',
                }}
              />
            </div>
          </div>
          <div className="sb-prog-item">
            <div className="sb-prog-label">
              <span>Task Management</span>
              <span style={{ color: '#8BA0BF' }}>5%</span>
            </div>
            <div className="sb-prog-bar">
              <div className="sb-prog-fill" style={{ width: '5%', background: '#4A6080' }} />
            </div>
          </div>
          <div className="sb-prog-item">
            <div className="sb-prog-label">
              <span>Payroll</span>
              <span style={{ color: '#4A6080' }}>0%</span>
            </div>
            <div className="sb-prog-bar">
              <div className="sb-prog-fill" style={{ width: '0%', background: '#3B82F6' }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Coming Soon Modal for future modules */}
      <ComingSoonModal
        isOpen={Boolean(comingSoonModule)}
        moduleName={comingSoonModule}
        onClose={() => setComingSoonModule(null)}
      />
    </>
  );
}
