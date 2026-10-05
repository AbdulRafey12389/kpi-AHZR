import React from 'react';
import { StatCard } from '../../../components/ui/StatCard';

export function KpiStatCards({ stats }) {
  const {
    totalEmployees = 0,
    avgScore = 0,
    excellentCount = 0,
    needsImprovementCount = 0,
    criticalCount = 0,
  } = stats || {};

  return (
    <div className="stats-grid sg-5">
      <StatCard
        variant="blue"
        icon="fa-users"
        number={totalEmployees}
        label="Total Employees"
      />
      <StatCard
        variant="gold"
        icon="fa-star"
        number={`${avgScore}%`}
        label="Avg KPI Score"
        subText="+2.4% vs last month"
        subType="up"
      />
      <StatCard
        variant="green"
        icon="fa-trophy"
        number={excellentCount}
        label="Excellent (85%+)"
      />
      <StatCard
        variant="amber"
        icon="fa-circle-exclamation"
        number={needsImprovementCount}
        label="Needs Improvement"
      />
      <StatCard
        variant="red"
        icon="fa-fire"
        number={criticalCount}
        label="Critical (<60%)"
      />
    </div>
  );
}
