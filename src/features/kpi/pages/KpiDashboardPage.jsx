import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { KpiStatCards } from '../components/KpiStatCards';
import { KpiCharts } from '../components/KpiCharts';
import { KpiTable } from '../components/KpiTable';
import { LoadingSpinner } from '../../../components/feedback/LoadingSpinner';

export function KpiDashboardPage() {
  const { kpiDataState } = useOutletContext();
  const navigate = useNavigate();
  const { kpiEntries, stats, topPerformers, loading } = kpiDataState;

  if (loading) {
    return <LoadingSpinner message="Calculating organization KPI metrics..." />;
  }

  const handleSelectEmployee = (empId) => {
    navigate(`/kpi/swot?emp=${empId}`);
  };

  return (
    <div>
      {/* 5-Metric Top Stats Grid */}
      <KpiStatCards stats={stats} />

      {/* Charts Grid */}
      <KpiCharts
        kpiEntries={kpiEntries}
        topPerformers={topPerformers}
        onSelectEmployee={handleSelectEmployee}
      />

      {/* Full Master KPI Register */}
      <KpiTable
        kpiEntries={kpiEntries}
        onViewEmployee={handleSelectEmployee}
      />
    </div>
  );
}
