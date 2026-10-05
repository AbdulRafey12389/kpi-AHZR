import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Radar, Bar } from 'react-chartjs-2';
import { Card } from '../../../components/ui/Card';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { getChartTheme } from '../utils/chartSetup';
import { DEPARTMENTS, DEPARTMENT_COLORS } from '../../../constants/departments';

export function DeptPerformancePage() {
  const { kpiDataState } = useOutletContext();
  const { departmentSummary, kpiEntries } = kpiDataState;
  const { isDark } = useTheme();
  const theme = useMemo(() => getChartTheme(isDark), [isDark]);

  // 1. Radar Chart Data (Multi-dept radar)
  const radarData = useMemo(() => {
    const datasets = DEPARTMENTS.map((dept) => {
      const empInDept = kpiEntries.filter(k => k.dept === dept);
      const avg = key =>
        empInDept.length
          ? Math.round(empInDept.reduce((a, k) => a + (Number(k[key]) || 0), 0) / empInDept.length)
          : 0;

      const color = DEPARTMENT_COLORS[dept] || '#3B82F6';

      return {
        label: dept.slice(0, 10),
        data: [
          avg('attScore'),
          avg('taskScore'),
          avg('behScore'),
          avg('kaiScore'),
          avg('total'),
        ],
        borderColor: color,
        backgroundColor: `${color}22`,
        borderWidth: 1.5,
        pointRadius: 2,
      };
    });

    return {
      labels: ['Attendance', 'Task', 'Behavior', 'Kaizen', 'Overall'],
      datasets,
    };
  }, [kpiEntries]);

  // 2. Score Comparison Bar Chart Data
  const compBarData = useMemo(() => {
    return {
      labels: DEPARTMENTS.map(d => (d.length > 8 ? d.slice(0, 7) + '…' : d)),
      datasets: [
        {
          label: 'Attendance',
          data: DEPARTMENTS.map(d => {
            const row = departmentSummary.find(item => item.dept === d);
            return row ? row.avgAttendance : 0;
          }),
          backgroundColor: '#3B82F6',
          borderRadius: 3,
        },
        {
          label: 'Task',
          data: DEPARTMENTS.map(d => {
            const row = departmentSummary.find(item => item.dept === d);
            return row ? row.avgTask : 0;
          }),
          backgroundColor: '#34D399',
          borderRadius: 3,
        },
        {
          label: 'Behavior',
          data: DEPARTMENTS.map(d => {
            const row = departmentSummary.find(item => item.dept === d);
            return row ? row.avgBehavior : 0;
          }),
          backgroundColor: '#A78BFA',
          borderRadius: 3,
        },
      ],
    };
  }, [departmentSummary]);

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        grid: { color: theme.grid },
        pointLabels: {
          color: theme.color,
          font: { size: 9, family: 'Inter' },
        },
        ticks: { display: false },
      },
    },
    plugins: {
      legend: {
        ...theme.legend,
        position: 'right',
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

  return (
    <div>
      {/* 2 Comparison Charts */}
      <div className="g2" style={{ marginBottom: '16px' }}>
        <Card title="Dept KPI Radar Analysis" icon="fa-chart-pie">
          <div className="chart-box">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </Card>

        <Card title="Dept Score Comparison" icon="fa-chart-bar">
          <div className="chart-box">
            <Bar data={compBarData} options={barOptions} />
          </div>
        </Card>
      </div>

      {/* Summary Table */}
      <Card title="Department Performance Summary" icon="fa-table" noPadding>
        <div className="table-wrap">
          <table className="kpi-table" id="deptTable">
            <thead>
              <tr>
                <th>Department</th>
                <th>Employees</th>
                <th>Avg Attendance</th>
                <th>Avg Task</th>
                <th>Avg Behavior</th>
                <th>Avg Kaizen</th>
                <th>Overall KPI</th>
                <th>Rating</th>
                <th>Best Performer</th>
              </tr>
            </thead>
            <tbody>
              {departmentSummary.map(row => (
                <tr key={row.dept}>
                  <td>
                    <strong>{row.dept}</strong>
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {row.employeeCount}
                  </td>
                  <td>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#3B82F6' }}>
                      {row.avgAttendance}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#34D399' }}>
                      {row.avgTask}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#A78BFA' }}>
                      {row.avgBehavior}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#FBBF24' }}>
                      {row.avgKaizen}%
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700,
                        color: row.barColor,
                      }}
                    >
                      {row.overallKpi}%
                    </span>
                  </td>
                  <td>
                    <span className={row.rating.cls}>{row.rating.label}</span>
                  </td>
                  <td style={{ fontSize: '11px' }}>{row.bestPerformerName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
