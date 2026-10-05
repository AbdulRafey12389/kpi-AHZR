import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField } from '../../../components/forms/FormField';
import { Input } from '../../../components/forms/Input';
import { useToast } from '../../../app/providers/ToastProvider';

export function FormulaWeightsPage() {
  const { kpiDataState } = useOutletContext();
  const { settings, saveSettings } = kpiDataState;
  const { showToast } = useToast();

  const [weights, setWeights] = useState({
    attendance: 30,
    task: 40,
    behavior: 20,
    kaizen: 10,
    deductPerLate: 0.5,
    maxLateDeduction: 5,
  });

  useEffect(() => {
    if (settings) {
      setWeights(settings);
    }
  }, [settings]);

  const totalSum =
    (Number(weights.attendance) || 0) +
    (Number(weights.task) || 0) +
    (Number(weights.behavior) || 0) +
    (Number(weights.kaizen) || 0);

  const isValidSum = totalSum === 100;

  const handleWeightChange = (field, val) => {
    setWeights(prev => ({ ...prev, [field]: Number(val) || 0 }));
  };

  const handleSaveWeights = async () => {
    if (!isValidSum) {
      showToast(`Weights sum is currently ${totalSum}%. Must equal exactly 100%.`, 'error');
      return;
    }
    await saveSettings(weights);
  };

  const handleSavePolicy = async () => {
    await saveSettings(weights);
    showToast('Late arrival deduction policy saved', 'success');
  };

  return (
    <div className="g2" style={{ marginBottom: '16px' }}>
      {/* Left Card: Standard Formula & Performance Ratings */}
      <Card title="KPI Formula — AZHR Standard" icon="fa-calculator">
        <div
          style={{
            background: 'var(--surface2)',
            borderRadius: '8px',
            padding: '14px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: 'var(--blue)',
            marginBottom: '14px',
            textAlign: 'center',
            lineHeight: 1.8,
          }}
        >
          Total Score = (Att×{weights.attendance}%) + (Task×{weights.task}%) + (Behav×{weights.behavior}%) + (Kaizen×{weights.kaizen}%)
        </div>

        <div className="formula-box">
          <div className="formula-row">
            <span className="formula-label">Attendance Score</span>
            <span className="formula-val">( Present / WorkDays ) × 100 – Deductions</span>
            <span className="formula-pct">{weights.attendance}%</span>
          </div>
          <div className="formula-row">
            <span className="formula-label">Task Score</span>
            <span className="formula-val">( Done / Assigned ) × OnTime%</span>
            <span className="formula-pct">{weights.task}%</span>
          </div>
          <div className="formula-row">
            <span className="formula-label">Behavior Score</span>
            <span className="formula-val">( Team + Disc + Comm ) / 30 × 100</span>
            <span className="formula-pct">{weights.behavior}%</span>
          </div>
          <div className="formula-row">
            <span className="formula-label">Kaizen Score</span>
            <span className="formula-val">( Approved / Submitted ) × 100</span>
            <span className="formula-pct">{weights.kaizen}%</span>
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <div className="sec-title">PERFORMANCE RATINGS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '11px',
                padding: '6px 10px',
                background: 'var(--surface2)',
                borderRadius: '6px',
              }}
            >
              <span className="rating-xo">⭐ Extra Ordinary</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--gold2)' }}>
                95% – 100%
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '11px',
                padding: '6px 10px',
                background: 'var(--surface2)',
                borderRadius: '6px',
              }}
            >
              <span className="rating-exc">Excellent</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--green2)' }}>
                85% – 94%
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '11px',
                padding: '6px 10px',
                background: 'var(--surface2)',
                borderRadius: '6px',
              }}
            >
              <span className="rating-good">Good</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--blue)' }}>
                70% – 84%
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '11px',
                padding: '6px 10px',
                background: 'var(--surface2)',
                borderRadius: '6px',
              }}
            >
              <span className="rating-norm">Normal</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--amber2)' }}>
                60% – 69%
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '11px',
                padding: '6px 10px',
                background: 'var(--surface2)',
                borderRadius: '6px',
              }}
            >
              <span className="rating-bad">Bad / Critical</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--red2)' }}>
                Below 60%
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Right Card: Customize Weights & Deductions */}
      <Card title="Customize KPI Weights" icon="fa-sliders">
        <div
          style={{
            background: 'rgba(251, 191, 36, 0.08)',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '11px',
            marginBottom: '14px',
            color: 'var(--amber2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <i className="fas fa-info-circle" />
          <span>Total weights must equal 100%. COO and HR Admin permissions required.</span>
        </div>

        <div className="form-row fr2">
          <FormField label="Attendance Weight (%)" icon="fa-calendar-check">
            <Input
              type="number"
              min="0"
              max="100"
              value={weights.attendance}
              onChange={e => handleWeightChange('attendance', e.target.value)}
            />
          </FormField>

          <FormField label="Task Weight (%)" icon="fa-list-check">
            <Input
              type="number"
              min="0"
              max="100"
              value={weights.task}
              onChange={e => handleWeightChange('task', e.target.value)}
            />
          </FormField>

          <FormField label="Behavior Weight (%)" icon="fa-handshake">
            <Input
              type="number"
              min="0"
              max="100"
              value={weights.behavior}
              onChange={e => handleWeightChange('behavior', e.target.value)}
            />
          </FormField>

          <FormField label="Kaizen Weight (%)" icon="fa-lightbulb">
            <Input
              type="number"
              min="0"
              max="100"
              value={weights.kaizen}
              onChange={e => handleWeightChange('kaizen', e.target.value)}
            />
          </FormField>
        </div>

        {/* Validation indicator */}
        <div
          style={{
            fontSize: '11px',
            padding: '8px 12px',
            borderRadius: '6px',
            marginBottom: '12px',
            background: isValidSum ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
            color: isValidSum ? 'var(--green2)' : 'var(--red2)',
            fontWeight: 600,
          }}
        >
          {isValidSum
            ? '✓ Weights sum = 100% — Valid'
            : `⚠ Current sum = ${totalSum}% — Must equal exactly 100%`}
        </div>

        <Button
          variant="primary"
          size="sm"
          icon="fa-save"
          onClick={handleSaveWeights}
          disabled={!isValidSum}
        >
          Save Weights
        </Button>

        {/* Late Arrival Deduction Policy */}
        <div style={{ marginTop: '20px' }}>
          <div className="sec-title">LATE ARRIVAL DEDUCTION POLICY</div>
          <div className="form-row fr2">
            <FormField label="Deduct per Late (points)">
              <Input
                type="number"
                step="0.25"
                min="0"
                value={weights.deductPerLate}
                onChange={e => handleWeightChange('deductPerLate', e.target.value)}
              />
            </FormField>

            <FormField label="Max Late Deduction (%)">
              <Input
                type="number"
                min="0"
                max="25"
                value={weights.maxLateDeduction}
                onChange={e => handleWeightChange('maxLateDeduction', e.target.value)}
              />
            </FormField>
          </div>

          <Button variant="outline" size="sm" icon="fa-save" onClick={handleSavePolicy}>
            Save Policy
          </Button>
        </div>
      </Card>
    </div>
  );
}
