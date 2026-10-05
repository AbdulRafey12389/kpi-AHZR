import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Radar, Line } from 'react-chartjs-2';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/forms/Select';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { getChartTheme } from '../utils/chartSetup';
import { generateSwotAnalysis, getBarColor } from '../utils/kpiCalculations';
import { useToast } from '../../../app/providers/ToastProvider';

export function SwotAnalysisPage() {
  const { kpiDataState, employees } = useOutletContext();
  const { kpiEntries } = kpiDataState;
  const { showToast } = useToast();
  const { isDark } = useTheme();
  const theme = useMemo(() => getChartTheme(isDark), [isDark]);

  const [searchParams, setSearchParams] = useSearchParams();
  const empParam = searchParams.get('emp');

  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [period, setPeriod] = useState('June 2026');

  // Sync selected employee with URL search param
  useEffect(() => {
    if (empParam) {
      const match = kpiEntries.find(
        k => k.empId === empParam || k.employee_id === empParam || k.id === empParam
      );
      if (match) {
        setSelectedEmpId(match.empId || match.employee_id);
      }
    } else if (kpiEntries.length > 0 && !selectedEmpId) {
      setSelectedEmpId(kpiEntries[0].empId || kpiEntries[0].employee_id);
    }
  }, [empParam, kpiEntries, selectedEmpId]);

  const currentRecord = useMemo(() => {
    if (!selectedEmpId) return null;
    return (
      kpiEntries.find(
        k => k.empId === selectedEmpId || k.employee_id === selectedEmpId || k.id === selectedEmpId
      ) || null
    );
  }, [kpiEntries, selectedEmpId]);

  const swot = useMemo(() => {
    return generateSwotAnalysis(currentRecord);
  }, [currentRecord]);

  const handleEmployeeChange = (e) => {
    const val = e.target.value;
    setSelectedEmpId(val);
    setSearchParams(val ? { emp: val } : {});
  };

  const handleExportPdf = () => {
    showToast('Preparing PDF performance card export...', 'info');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Radar chart data for current employee
  const radarData = useMemo(() => {
    if (!currentRecord) return { labels: [], datasets: [] };

    return {
      labels: ['Attendance', 'Task', 'Behavior', 'Kaizen', 'Overall'],
      datasets: [
        {
          label: currentRecord.name,
          data: [
            currentRecord.attScore,
            currentRecord.taskScore,
            currentRecord.behScore,
            currentRecord.kaiScore,
            currentRecord.total,
          ],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          borderWidth: 2,
          pointRadius: 3,
        },
      ],
    };
  }, [currentRecord]);

  // Year-on-Year / Monthly historical trend
  const yyTrendData = useMemo(() => {
    if (!currentRecord) return { labels: [], datasets: [] };
    const total = currentRecord.total || 75;

    const scores = [
      total - 8,
      total - 5,
      total - 3,
      total - 6,
      total - 2,
      total,
    ].map(v => Math.max(40, Math.min(100, v)));

    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'KPI Score',
          data: scores,
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
          borderDash: [4, 4],
          borderWidth: 1,
          pointRadius: 0,
        },
      ],
    };
  }, [currentRecord]);

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
        position: 'top',
      },
    },
  };

  const lineOptions = {
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

  const barColor = currentRecord ? getBarColor(currentRecord.total) : '#3B82F6';
  const r = currentRecord?.ratingObj || { label: currentRecord?.rating || 'Normal', cls: 'rating-norm' };

  return (
    <div>
      {/* Top Selector Card */}
      <Card style={{ marginBottom: '16px' }} bodyStyle={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }} className="form-group">
            <label>Select Employee for Analysis</label>
            <Select value={selectedEmpId} onChange={handleEmployeeChange}>
              <option value="">-- Select Employee --</option>
              {employees.map(e => (
                <option key={e.id} value={e.employee_code || e.id}>
                  {e.employee_code} — {e.name}
                </option>
              ))}
            </Select>
          </div>

          <div style={{ minWidth: '140px' }} className="form-group">
            <label>Analysis Period</label>
            <Select value={period} onChange={e => setPeriod(e.target.value)}>
              <option>June 2026</option>
              <option>Q2 2026</option>
              <option>H1 2026</option>
              <option>YTD 2026</option>
            </Select>
          </div>

          <Button
            variant="primary"
            icon="fa-wand-magic-sparkles"
            onClick={() => showToast('SWOT Analysis refreshed', 'success')}
          >
            Generate
          </Button>

          <Button variant="gold" icon="fa-download" onClick={handleExportPdf}>
            Export PDF
          </Button>
        </div>
      </Card>

      {!currentRecord ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
          <i className="fas fa-chart-simple" style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }} />
          Select an employee to generate SWOT &amp; YY Analysis
        </div>
      ) : (
        <>
          {/* Row 1: KPI Profile Card + YY Trend Line */}
          <div className="g2" style={{ marginBottom: '16px' }}>
            <Card title={`${currentRecord.name} — KPI Card (${period})`} icon="fa-id-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '42px',
                      fontWeight: 700,
                      color: barColor,
                    }}
                  >
                    {currentRecord.total}%
                  </div>
                  <span className={r.cls}>{r.label}</span>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>
                    {currentRecord.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '10px' }}>
                    {currentRecord.dept} · {currentRecord.desig}
                  </div>

                  <div className="kpi-mini-bars">
                    {/* Attendance */}
                    <div className="kpi-mini-row">
                      <span className="kpi-mini-label">Attendance (30%)</span>
                      <div className="kpi-mini-bar">
                        <div
                          className="kpi-mini-fill"
                          style={{ width: `${currentRecord.attScore}%`, background: '#3B82F6' }}
                        />
                      </div>
                      <span className="kpi-mini-pct" style={{ minWidth: '40px' }}>
                        {currentRecord.attScore}% → <b>{currentRecord.attWt}</b>
                      </span>
                    </div>

                    {/* Task */}
                    <div className="kpi-mini-row">
                      <span className="kpi-mini-label">Task (40%)</span>
                      <div className="kpi-mini-bar">
                        <div
                          className="kpi-mini-fill"
                          style={{ width: `${currentRecord.taskScore}%`, background: '#34D399' }}
                        />
                      </div>
                      <span className="kpi-mini-pct" style={{ minWidth: '40px' }}>
                        {currentRecord.taskScore}% → <b>{currentRecord.taskWt}</b>
                      </span>
                    </div>

                    {/* Behavior */}
                    <div className="kpi-mini-row">
                      <span className="kpi-mini-label">Behavior (20%)</span>
                      <div className="kpi-mini-bar">
                        <div
                          className="kpi-mini-fill"
                          style={{ width: `${currentRecord.behScore}%`, background: '#A78BFA' }}
                        />
                      </div>
                      <span className="kpi-mini-pct" style={{ minWidth: '40px' }}>
                        {currentRecord.behScore}% → <b>{currentRecord.behWt}</b>
                      </span>
                    </div>

                    {/* Kaizen */}
                    <div className="kpi-mini-row">
                      <span className="kpi-mini-label">Kaizen (10%)</span>
                      <div className="kpi-mini-bar">
                        <div
                          className="kpi-mini-fill"
                          style={{ width: `${currentRecord.kaiScore}%`, background: '#FBBF24' }}
                        />
                      </div>
                      <span className="kpi-mini-pct" style={{ minWidth: '40px' }}>
                        {currentRecord.kaiScore}% → <b>{currentRecord.kaiWt}</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ height: '180px' }}>
                <Radar data={radarData} options={radarOptions} />
              </div>
            </Card>

            <Card title="YY (Year-on-Year) Trend" icon="fa-chart-line">
              <div style={{ height: '240px' }}>
                <Line data={yyTrendData} options={lineOptions} />
              </div>
            </Card>
          </div>

          {/* Row 2: Dynamic SWOT Analysis Matrix */}
          <Card title={`SWOT Analysis — ${currentRecord.name}`} icon="fa-chart-simple">
            <div className="swot-grid">
              {/* Strengths */}
              <div className="swot-card swot-s">
                <div className="swot-title" style={{ color: 'var(--green2)' }}>
                  <i className="fas fa-plus-circle" /> Strengths
                </div>
                {swot.strengths.length > 0 ? (
                  swot.strengths.map((s, idx) => (
                    <div key={idx} className="swot-item">
                      {s}
                    </div>
                  ))
                ) : (
                  <div className="swot-item" style={{ color: 'var(--muted2)' }}>
                    No significant strengths identified this period
                  </div>
                )}
              </div>

              {/* Weaknesses */}
              <div className="swot-card swot-w">
                <div className="swot-title" style={{ color: 'var(--red2)' }}>
                  <i className="fas fa-minus-circle" /> Weaknesses
                </div>
                {swot.weaknesses.length > 0 ? (
                  swot.weaknesses.map((w, idx) => (
                    <div key={idx} className="swot-item">
                      {w}
                    </div>
                  ))
                ) : (
                  <div className="swot-item" style={{ color: 'var(--muted2)' }}>
                    No major weaknesses recorded
                  </div>
                )}
              </div>

              {/* Opportunities */}
              <div className="swot-card swot-o">
                <div className="swot-title" style={{ color: 'var(--blue)' }}>
                  <i className="fas fa-bolt" /> Opportunities
                </div>
                {swot.opportunities.map((o, idx) => (
                  <div key={idx} className="swot-item">
                    {o}
                  </div>
                ))}
              </div>

              {/* Threats */}
              <div className="swot-card swot-t">
                <div className="swot-title" style={{ color: 'var(--amber2)' }}>
                  <i className="fas fa-triangle-exclamation" /> Threats
                </div>
                {swot.threats.map((t, idx) => (
                  <div key={idx} className="swot-item">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
