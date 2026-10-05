import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getKpiEntries,
  createKpiEntry,
  getKpiSettings,
  updateKpiSettings,
} from '../services/kpiService';
import { getBarColor, getKpiRating } from '../utils/kpiCalculations';
import { DEPARTMENTS } from '../../../constants/departments';
import { CURRENT_KPI_MONTH } from '../../../constants/kpiConstants';
import { useToast } from '../../../app/providers/ToastProvider';

export function useKpiData(initialFilters = {}) {
  const [kpiEntries, setKpiEntries] = useState([]);
  const [settings, setSettings] = useState({
    attendance: 30,
    task: 40,
    behavior: 20,
    kaizen: 10,
    deductPerLate: 0.5,
    maxLateDeduction: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    month: CURRENT_KPI_MONTH,
    department: 'all',
    search: '',
    ...initialFilters,
  });
  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [entries, currentSettings] = await Promise.all([
        getKpiEntries(filters),
        getKpiSettings(),
      ]);
      setKpiEntries(entries);
      if (currentSettings) setSettings(currentSettings);
    } catch (err) {
      setError(err.message || 'Failed to load KPI data');
      showToast(err.message || 'Failed to load KPI data', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Overall Statistics computed from entries
  const stats = useMemo(() => {
    if (!kpiEntries.length) {
      return {
        totalEmployees: 0,
        avgScore: 0,
        excellentCount: 0,
        needsImprovementCount: 0,
        criticalCount: 0,
      };
    }

    const total = kpiEntries.length;
    const avgScore = Math.round(
      kpiEntries.reduce((sum, k) => sum + (Number(k.total) || 0), 0) / total
    );
    const excellentCount = kpiEntries.filter(k => k.total >= 85).length;
    const needsImprovementCount = kpiEntries.filter(k => k.total >= 60 && k.total < 70).length;
    const criticalCount = kpiEntries.filter(k => k.total < 60).length;

    return {
      totalEmployees: total,
      avgScore,
      excellentCount,
      needsImprovementCount,
      criticalCount,
    };
  }, [kpiEntries]);

  // Top 5 Performers
  const topPerformers = useMemo(() => {
    return [...kpiEntries].sort((a, b) => b.total - a.total).slice(0, 5);
  }, [kpiEntries]);

  // Department Aggregated Summary
  const departmentSummary = useMemo(() => {
    const map = {};

    DEPARTMENTS.forEach(dept => {
      map[dept] = {
        dept,
        count: 0,
        attSum: 0,
        taskSum: 0,
        behSum: 0,
        kaiSum: 0,
        totalSum: 0,
        bestPerformer: null,
      };
    });

    kpiEntries.forEach(k => {
      const dept = k.dept || 'Production';
      if (!map[dept]) {
        map[dept] = {
          dept,
          count: 0,
          attSum: 0,
          taskSum: 0,
          behSum: 0,
          kaiSum: 0,
          totalSum: 0,
          bestPerformer: null,
        };
      }

      const d = map[dept];
      d.count++;
      d.attSum += k.attScore;
      d.taskSum += k.taskScore;
      d.behSum += k.behScore;
      d.kaiSum += k.kaiScore;
      d.totalSum += k.total;

      if (!d.bestPerformer || k.total > d.bestPerformer.total) {
        d.bestPerformer = k;
      }
    });

    return Object.values(map).map(d => {
      const count = d.count || 1;
      const avgTotal = Math.round(d.totalSum / count);
      return {
        dept: d.dept,
        employeeCount: d.count,
        avgAttendance: Math.round(d.attSum / count),
        avgTask: Math.round(d.taskSum / count),
        avgBehavior: Math.round(d.behSum / count),
        avgKaizen: Math.round(d.kaiSum / count),
        overallKpi: avgTotal,
        rating: getKpiRating(avgTotal),
        barColor: getBarColor(avgTotal),
        bestPerformerName: d.bestPerformer ? d.bestPerformer.name : '—',
      };
    });
  }, [kpiEntries]);

  // Save new KPI entry
  const recordKpi = async (entryData) => {
    try {
      const saved = await createKpiEntry(entryData);
      setKpiEntries(prev => {
        const idx = prev.findIndex(k => k.employee_id === saved.employee_id && k.month === saved.month);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = saved;
          return updated;
        }
        return [saved, ...prev];
      });
      showToast(`KPI entry recorded for ${saved.name} (Total: ${saved.total}%)`, 'success');
      return saved;
    } catch (err) {
      showToast(err.message || 'Error recording KPI', 'error');
      throw err;
    }
  };

  // Save weights & deduction policies
  const saveSettings = async (newSettings) => {
    try {
      await updateKpiSettings(newSettings);
      setSettings(newSettings);
      showToast('KPI Weights & Policy saved successfully', 'success');
      // Reload KPI data to recompute totals
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to save settings', 'error');
      throw err;
    }
  };

  return {
    kpiEntries,
    settings,
    loading,
    error,
    filters,
    setFilters,
    stats,
    topPerformers,
    departmentSummary,
    recordKpi,
    saveSettings,
    reload: loadData,
  };
}
