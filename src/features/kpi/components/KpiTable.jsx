import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { getBarColor } from '../utils/kpiCalculations';
import { EmptyState } from '../../../components/feedback/EmptyState';

export function KpiTable({ kpiEntries = [], onViewEmployee }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = useMemo(() => {
    if (!searchTerm.trim()) return kpiEntries;
    const term = searchTerm.toLowerCase().trim();
    return kpiEntries.filter(k => {
      const name = (k.name || '').toLowerCase();
      const empId = (k.empId || k.employee_id || '').toLowerCase();
      const dept = (k.dept || '').toLowerCase();
      return name.includes(term) || empId.includes(term) || dept.includes(term);
    });
  }, [kpiEntries, searchTerm]);

  return (
    <Card
      title="KPI Register — All Employees"
      icon="fa-table"
      noPadding
      rightAction={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="text"
            placeholder="Search employees or IDs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '180px', fontSize: '11px', padding: '4px 8px' }}
          />
        </div>
      }
    >
      {filteredEntries.length === 0 ? (
        <EmptyState
          icon="fa-search"
          title="No employees match your search"
          description="Try typing a different name, department, or employee ID."
        />
      ) : (
        <div className="table-wrap">
          <table className="kpi-table" id="kpiMainTable">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Dept</th>
                <th>Attendance (30%)</th>
                <th>Task (40%)</th>
                <th>Behavior (20%)</th>
                <th>Kaizen (10%)</th>
                <th>Total Score</th>
                <th>Rating</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(k => {
                const totalColor = getBarColor(k.total);
                const r = k.ratingObj || { label: k.rating, cls: 'rating-norm' };

                return (
                  <tr key={k.id || k.empId}>
                    <td
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '10px',
                        color: 'var(--muted)',
                      }}
                    >
                      {k.empId || k.employee_id}
                    </td>
                    <td>
                      <strong>{k.name}</strong>
                    </td>
                    <td>{k.dept}</td>

                    {/* Attendance */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ProgressBar percentage={k.attScore} color="#3B82F6" minWidth="60px" />
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>
                          {k.attScore}%
                        </span>
                      </div>
                    </td>

                    {/* Task */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ProgressBar percentage={k.taskScore} color="#34D399" minWidth="60px" />
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>
                          {k.taskScore}%
                        </span>
                      </div>
                    </td>

                    {/* Behavior */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ProgressBar percentage={k.behScore} color="#A78BFA" minWidth="60px" />
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>
                          {k.behScore}%
                        </span>
                      </div>
                    </td>

                    {/* Kaizen */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ProgressBar percentage={k.kaiScore} color="#FBBF24" minWidth="60px" />
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>
                          {k.kaiScore}%
                        </span>
                      </div>
                    </td>

                    {/* Total Score */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ProgressBar
                          percentage={k.total}
                          color={totalColor}
                          minWidth="50px"
                        />
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '12px',
                            fontWeight: 700,
                            color: totalColor,
                          }}
                        >
                          {k.total}%
                        </span>
                      </div>
                    </td>

                    {/* Rating Badge */}
                    <td>
                      <span className={r.cls}>{r.label}</span>
                    </td>

                    {/* Action */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => onViewEmployee && onViewEmployee(k.empId || k.employee_id)}
                        title="View SWOT & Performance Profile"
                      >
                        <i className="fas fa-eye" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
