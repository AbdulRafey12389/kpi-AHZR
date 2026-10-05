import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';

// KPI Module
import { KpiLayout } from '../features/kpi/components/KpiLayout';
import { KpiDashboardPage } from '../features/kpi/pages/KpiDashboardPage';
import { KpiEntryPage } from '../features/kpi/pages/KpiEntryPage';
import { EmployeeKpisPage } from '../features/kpi/pages/EmployeeKpisPage';
import { DeptPerformancePage } from '../features/kpi/pages/DeptPerformancePage';
import { SwotAnalysisPage } from '../features/kpi/pages/SwotAnalysisPage';
import { FormulaWeightsPage } from '../features/kpi/pages/FormulaWeightsPage';

// Employee Module
import { EmployeeListPage } from '../features/employees/pages/EmployeeListPage';
import { AddEmployeePage } from '../features/employees/pages/AddEmployeePage';
import { EditEmployeePage } from '../features/employees/pages/EditEmployeePage';
import { EmployeeDetailsPage } from '../features/employees/pages/EmployeeDetailsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Default route redirect to KPI Dashboard */}
        <Route path="/" element={<Navigate to="/kpi/dashboard" replace />} />
        <Route path="/dashboard" element={<Navigate to="/kpi/dashboard" replace />} />

        {/* KPI & Progress Module */}
        <Route path="/kpi" element={<KpiLayout />}>
          <Route index element={<Navigate to="/kpi/dashboard" replace />} />
          <Route path="dashboard" element={<KpiDashboardPage />} />
          <Route path="entry" element={<KpiEntryPage />} />
          <Route path="employees" element={<EmployeeKpisPage />} />
          <Route path="departments" element={<DeptPerformancePage />} />
          <Route path="swot" element={<SwotAnalysisPage />} />
          <Route path="formula" element={<FormulaWeightsPage />} />
        </Route>

        {/* Employee Management Module */}
        <Route path="/employees">
          <Route index element={<EmployeeListPage />} />
          <Route path="new" element={<AddEmployeePage />} />
          <Route path=":id" element={<EmployeeDetailsPage />} />
          <Route path=":id/edit" element={<EditEmployeePage />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/kpi/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
