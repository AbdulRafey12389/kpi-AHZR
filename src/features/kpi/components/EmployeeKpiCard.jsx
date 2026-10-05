import React from 'react';
import { getBarColor } from '../utils/kpiCalculations';

export function EmployeeKpiCard({ kpiRecord, onClick }) {
  const k = kpiRecord;
  const barColor = getBarColor(k.total);
  const r = k.ratingObj || { label: k.rating, cls: 'rating-norm' };

  return (
    <div className="emp-kpi-card" onClick={onClick} title="Click to view SWOT Analysis">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <div className="emp-name">{k.name}</div>
          <div className="emp-dept">
            {k.dept} · {k.desig}
          </div>
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '20px',
            fontWeight: 700,
            color: barColor,
          }}
        >
          {k.total}%
        </div>
      </div>

      <span className={r.cls} style={{ fontSize: '9px', marginBottom: '10px', display: 'inline-block' }}>
        {r.label}
      </span>

      <div className="kpi-mini-bars">
        <div className="kpi-mini-row">
          <span className="kpi-mini-label">Attendance</span>
          <div className="kpi-mini-bar">
            <div className="kpi-mini-fill" style={{ width: `${k.attScore}%`, background: '#3B82F6' }} />
          </div>
          <span className="kpi-mini-pct">{k.attScore}%</span>
        </div>

        <div className="kpi-mini-row">
          <span className="kpi-mini-label">Task</span>
          <div className="kpi-mini-bar">
            <div className="kpi-mini-fill" style={{ width: `${k.taskScore}%`, background: '#34D399' }} />
          </div>
          <span className="kpi-mini-pct">{k.taskScore}%</span>
        </div>

        <div className="kpi-mini-row">
          <span className="kpi-mini-label">Behavior</span>
          <div className="kpi-mini-bar">
            <div className="kpi-mini-fill" style={{ width: `${k.behScore}%`, background: '#A78BFA' }} />
          </div>
          <span className="kpi-mini-pct">{k.behScore}%</span>
        </div>

        <div className="kpi-mini-row">
          <span className="kpi-mini-label">Kaizen</span>
          <div className="kpi-mini-bar">
            <div className="kpi-mini-fill" style={{ width: `${k.kaiScore}%`, background: '#FBBF24' }} />
          </div>
          <span className="kpi-mini-pct">{k.kaiScore}%</span>
        </div>
      </div>
    </div>
  );
}
