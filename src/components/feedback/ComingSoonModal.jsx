import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function ComingSoonModal({ isOpen, onClose, moduleName }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${moduleName || 'Module'} — Phase 2 Roadmap`}
      icon="fa-clock"
      maxWidth="480px"
    >
      <div style={{ textAlign: 'center', padding: '16px 8px' }}>
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--blue)',
            fontSize: '22px',
          }}
        >
          <i className="fas fa-layer-group" />
        </div>
        <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>
          {moduleName} Module Coming Soon
        </h4>
        <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '20px' }}>
          In this initial phase of AZHR HRMS, we have focused on core <strong>Employee Management</strong> and 
          <strong> KPI &amp; Progress Management (M06)</strong>.
          <br /><br />
          The {moduleName} module is slated for the upcoming release in accordance with the Takhleeq 2026 deployment roadmap.
        </p>
        <Button variant="primary" onClick={onClose} style={{ minWidth: '120px' }}>
          Got it
        </Button>
      </div>
    </Modal>
  );
}
