import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { EmployeeKpiCard } from '../components/EmployeeKpiCard';
import { Select } from '../../../components/forms/Select';
import { DEPARTMENTS } from '../../../constants/departments';
import { EmptyState } from '../../../components/feedback/EmptyState';

export function EmployeeKpisPage() {
  const { kpiDataState } = useOutletContext();
  const navigate = useNavigate();
  const { kpiEntries } = kpiDataState;

  const [ratingFilter, setRatingFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  const filteredData = useMemo(() => {
    let result = kpiEntries;

    if (deptFilter !== 'all') {
      result = result.filter(k => k.dept === deptFilter);
    }

    if (ratingFilter === 'xo') {
      result = result.filter(k => k.total >= 95);
    } else if (ratingFilter === 'excellent') {
      result = result.filter(k => k.total >= 85 && k.total < 95);
    } else if (ratingFilter === 'good') {
      result = result.filter(k => k.total >= 70 && k.total < 85);
    } else if (ratingFilter === 'normal') {
      result = result.filter(k => k.total >= 60 && k.total < 70);
    } else if (ratingFilter === 'bad') {
      result = result.filter(k => k.total < 60);
    }

    return result;
  }, [kpiEntries, deptFilter, ratingFilter]);

  return (
    <div>
      {/* Filters Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Select
          value={ratingFilter}
          onChange={e => setRatingFilter(e.target.value)}
          style={{ width: '180px', fontSize: '11px', padding: '6px 10px' }}
        >
          <option value="all">All Rating Tiers</option>
          <option value="xo">Extra Ordinary (95%+)</option>
          <option value="excellent">Excellent (85-94%)</option>
          <option value="good">Good (70-84%)</option>
          <option value="normal">Normal (60-69%)</option>
          <option value="bad">Bad / Critical (&lt;60%)</option>
        </Select>

        <Select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          style={{ width: '180px', fontSize: '11px', padding: '6px 10px' }}
        >
          <option value="all">All Departments</option>
          {DEPARTMENTS.map(d => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>

        <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: 'auto' }}>
          Showing <strong>{filteredData.length}</strong> employees
        </span>
      </div>

      {/* Grid of Employee KPI Cards */}
      {filteredData.length === 0 ? (
        <EmptyState
          icon="fa-filter"
          title="No employees match selected filters"
          description="Adjust the rating or department dropdowns above."
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '12px',
          }}
        >
          {filteredData.map(k => (
            <EmployeeKpiCard
              key={k.id || k.empId}
              kpiRecord={k}
              onClick={() => navigate(`/kpi/swot?emp=${k.empId || k.employee_id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
