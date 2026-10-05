import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../app/providers/ThemeProvider';
import { isSupabaseConfigured } from '../lib/supabase';

export function TopNavbar() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [dateString, setDateString] = useState('');
  const isConnected = isSupabaseConfigured();

  useEffect(() => {
    const now = new Date();
    setDateString(
      now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  const getModuleTitle = () => {
    if (location.pathname.startsWith('/employees')) {
      return (
        <>
          AZHR <span>/ Employee Management</span>
        </>
      );
    }
    return (
      <>
        AZHR <span>/ M06 — KPI &amp; Progress Management</span>
      </>
    );
  };

  return (
    <header className="topnav">
      <div className="topnav-title">{getModuleTitle()}</div>

      {/* Backend connection indicator */}
      <div
        className={`supabase-badge ${isConnected ? 'connected' : 'demo'}`}
        title={
          isConnected
            ? 'Connected to live Supabase database'
            : 'Running in resilient Demo Mode with local persistence'
        }
      >
        <i className={`fas fa-${isConnected ? 'database' : 'hard-drive'}`} />
        <span>{isConnected ? 'Supabase: Live' : 'Demo DB Mode'}</span>
      </div>

      {/* Date display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--muted)' }}>
        <i className="fas fa-calendar" />
        <span>{dateString}</span>
      </div>

      {/* Theme toggle */}
      <div className="theme-toggle" onClick={toggleTheme} title="Toggle theme mode">
        <i className="fas fa-circle-half-stroke" />
        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </div>

      {/* Executive User profile */}
      <div className="topnav-user" title="Adnan Zafar — Chief Operating Officer">
        <div className="user-av">AZ</div>
        <span style={{ fontSize: '12px' }}>Adnan Zafar</span>
        <span style={{ fontSize: '10px', color: 'var(--muted)' }}>COO</span>
        <i className="fas fa-chevron-down" style={{ fontSize: '9px', color: 'var(--muted)', marginLeft: '4px' }} />
      </div>
    </header>
  );
}
