import React, { useMemo } from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Card } from '../../../components/ui/Card';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { getChartTheme } from '../utils/chartSetup';
import { getBarColor } from '../utils/kpiCalculations';
import { DEPARTMENTS } from '../../../constants/departments';

export function KpiCharts({ kpiEntries = [], topPerformers = [], onSelectEmployee }) {
  const { isDark } = useTheme();
  const theme = useMemo(() => getChartTheme(isDark), [isDark]);

  // 1. Rating Distribution Doughnut Data
  const ratingDistributionData = useMemo(() => {
    const xo = kpiEntries.filter(k => k.total >= 95).length;
    const exc = kpiEntries.filter(k => k.total >= 85 && k.total < 95).length;
    const good = kpiEntries.filter(k => k.total >= 70 && k.total < 85).length;
    const norm = kpiEntries.filter(k => k.total >= 60 && k.total < 70).length;
    const bad = kpiEntries.filter(k => k.total < 60).length;

    return {
      labels: ['⭐ Extra Ord.', 'Excellent', 'Good', 'Normal', 'Bad'],
      datasets: [
        {
          data: [xo, exc, good, norm, bad],
          backgroundColor: ['#D4A843', '#34D399', '#3B82F6', '#FBBF24', '#F87171'],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    };
  }, [kpiEntries]);

  // 2. Component Breakdown Bar Data
  const componentBreakdownData = useMemo(() => {
    if (!kpiEntries.length) {
      return { labels: ['Attendance', 'Task', 'Behavior', 'Kaizen'], datasets: [] };
    }
    const avg = arr => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

    return {
      labels: ['Attendance (30%)', 'Task (40%)', 'Behavior (20%)', 'Kaizen (10%)'],
      datasets: [
        {
          label: 'Avg Score %',
          data: [
            avg(kpiEntries.map(k => k.attScore)),
            avg(kpiEntries.map(k => k.taskScore)),
            avg(kpiEntries.map(k => k.behScore)),
            avg(kpiEntries.map(k => k.kaiScore)),
          ],
          backgroundColor: ['#3B82F6', '#34D399', '#A78BFA', '#FBBF24'],
          borderRadius: 4,
        },
      ],
    };
  }, [kpiEntries]);

  // 3. Monthly Trend Line Data
  const trendData = useMemo(() => {
    const avg = kpiEntries.length
      ? Math.round(kpiEntries.reduce((a, k) => a + k.total, 0) / kpiEntries.length)
      : 76;

    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Avg KPI Score',
          data: [avg - 5, avg - 3, avg - 4, avg - 1, avg - 2, avg],
          borderColor: '#D4A843',
          backgroundColor: 'rgba(212, 168, 67, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
        },
        {
          label: 'Target (85%)',
          data: [85, 85, 85, 85, 85, 85],
          borderColor: 'rgba(52, 211, 153, 0.5)',
          borderDash: [5, 5],
          borderWidth: 1,
          pointRadius: 0,
        },
      ],
    };
  }, [kpiEntries]);

  // 4. Department-wise KPI Score Bar Data
  const deptKpiData = useMemo(() => {
    const deptAvgs = DEPARTMENTS.map(dept => {
      const inDept = kpiEntries.filter(k => k.dept === dept);
      if (!inDept.length) return 0;
      return Math.round(inDept.reduce((a, k) => a + k.total, 0) / inDept.length);
    });

    const colors = deptAvgs.map(v => getBarColor(v));

    return {
      labels: DEPARTMENTS.map(d => (d.length > 10 ? d.slice(0, 9) + '…' : d)),
      datasets: [
        {
          label: 'Dept KPI %',
          data: deptAvgs,
          backgroundColor: colors,
          borderRadius: 5,
        },
      ],
    };
  }, [kpiEntries]);

  // Chart Options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        ...theme.legend,
        position: 'bottom',
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: theme.legend },
    scales: {
      x: theme.scales.x,
      y: {
        ...theme.scales.y,
        min: 0,
        max: 100,
      },
    },
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: theme.legend },
    scales: {
      x: theme.scales.x,
      y: {
        ...theme.scales.y,
        min: 40,
        max: 100,
      },
    },
  };

  const deptBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: theme.legend },
    scales: {
      x: theme.scales.x,
      y: {
        ...theme.scales.y,
        min: 40,
        max: 100,
      },
    },
  };

  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

  return (
    <>
      {/* Row 1: 3 Charts */}
      <div className="g3" style={{ marginBottom: '16px' }}>
        <Card title="Overall Rating Distribution" icon="fa-chart-pie">
          <div className="chart-box-sm">
            <Doughnut data={ratingDistributionData} options={doughnutOptions} />
          </div>
        </Card>

        <Card title="KPI Component Breakdown" icon="fa-chart-bar">
          <div className="chart-box-sm">
            <Bar data={componentBreakdownData} options={barOptions} />
          </div>
        </Card>

        <Card title="Monthly KPI Trend" icon="fa-chart-line">
          <div className="chart-box-sm">
            <Line data={trendData} options={trendOptions} />
          </div>
        </Card>
      </div>

      {/* Row 2: Department-wise Bar + Top 5 Performers */}
      <div className="g65" style={{ marginBottom: '16px' }}>
        <Card title="Department-wise KPI Score" icon="fa-building">
          <div className="chart-box">
            <Bar data={deptKpiData} options={deptBarOptions} />
          </div>
        </Card>

        <Card title="Top 5 Performers" icon="fa-medal">
          <div>
            {topPerformers.map((k, index) => {
              const color = getBarColor(k.total);
              return (
                <div
                  key={k.id || k.empId}
                  onClick={() => onSelectEmployee && onSelectEmployee(k.empId || k.employee_id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    padding: '4px 6px',
                    borderRadius: '6px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  title="Click to view SWOT Analysis"
                >
                  <span style={{ fontSize: '16px' }}>{medals[index] || '⭐'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {k.name}
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--muted)' }}>
                      {k.dept} · {k.desig}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '14px',
                      fontWeight: 700,
                      color: color,
                    }}
                  >
                    {k.total}%
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
