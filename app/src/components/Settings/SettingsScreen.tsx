// ============================================================
// Kairo — Pantalla de Ajustes
// Pestañas: DURACIÓN / ALERTAS / SISTEMA
// Fuente visual: docs/design.md §7.2
// ============================================================

import { useState } from 'react';
import type { TimerConfig } from '../../logic/config';
import { Switch } from './Switch';

export type SettingsKey = keyof TimerConfig;

interface SettingsScreenProps {
  config: TimerConfig;
  onEditField: (key: SettingsKey) => void;
  onClose: () => void;
  // Alertas
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  autoStartNext: boolean;
  onToggleNotifications: (val: boolean) => void;
  onToggleSound: (val: boolean) => void;
  onToggleAutoStart: (val: boolean) => void;
  // Sistema
  alwaysOnTop: boolean;
  autostart: boolean;
  minimizeToTray: boolean;
  compact: boolean;
  onToggleAlwaysOnTop: () => void;
  onToggleAutostart: () => void;
  onToggleMinimizeToTray: () => void;
  onToggleCompact: () => void;
}

type Tab = 'duration' | 'notifications' | 'system';

function Row({ label, right }: { label: string; right: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 42,
        padding: '0 12px',
      }}
    >
      <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font)' }}>{label}</span>
      {right}
    </div>
  );
}

export function SettingsScreen({
  config,
  onEditField,
  onClose,
  notificationsEnabled,
  soundEnabled,
  autoStartNext,
  onToggleNotifications,
  onToggleSound,
  onToggleAutoStart,
  alwaysOnTop,
  autostart,
  minimizeToTray,
  compact,
  onToggleAlwaysOnTop,
  onToggleAutostart,
  onToggleMinimizeToTray,
  onToggleCompact,
}: SettingsScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>('duration');

  const durationRows: { key: SettingsKey; label: string; value: number; unit: string }[] = [
    { key: 'focusDuration', label: 'Concentración', value: config.focusDuration, unit: 'min' },
    {
      key: 'shortBreakDuration',
      label: 'Descanso corto',
      value: config.shortBreakDuration,
      unit: 'min',
    },
    {
      key: 'longBreakDuration',
      label: 'Descanso largo',
      value: config.longBreakDuration,
      unit: 'min',
    },
    {
      key: 'longBreakAfter',
      label: 'Descanso largo tras',
      value: config.longBreakAfter,
      unit: 'Ses.',
    },
  ];

  const tabs: { id: Tab; label: string }[] = [
    { id: 'duration', label: 'DURACIÓN' },
    { id: 'notifications', label: 'NOTIFICACIONES' },
    { id: 'system', label: 'SISTEMA' },
  ];

  return (
    <div
      className='screen-enter'
      style={{ position: 'relative', width: '100%', height: '100%', userSelect: 'none' }}
    >
      {/* Encabezado */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 40,
        }}
      >
        <button
          className='screen-back-button interactive-control'
          type='button'
          onClick={onClose}
          aria-label='Volver al temporizador'
          title='Volver al temporizador'
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.75'
            strokeLinecap='round'
            strokeLinejoin='round'
            aria-hidden='true'
          >
            <path d='M15 18l-6-6 6-6' />
          </svg>
        </button>
        <span
          style={{ fontSize: 20, fontWeight: 400, color: 'var(--text)', fontFamily: 'var(--font)' }}
        >
          Ajustes
        </span>
      </div>

      {/* Pestañas pill */}
      <div
        style={{
          position: 'absolute',
          top: 76,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 284,
          height: 36,
          borderRadius: 9999,
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          padding: 2,
          boxSizing: 'border-box',
        }}
      >
        <span className='settings-tab-indicator' data-tab={activeTab} aria-hidden='true' />
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type='button'
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
            style={{
              flex: 1,
              borderRadius: 9999,
              position: 'relative',
              zIndex: 1,
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? 'var(--text)' : 'var(--text-muted)',
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: '0.12em',
              cursor: 'pointer',
              outline: 'none',
              transition: 'color 180ms ease',
              fontFamily: 'var(--font)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div
        style={{
          position: 'absolute',
          top: 124,
          left: 18,
          right: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {/* DURACIÓN */}
        {activeTab === 'duration' &&
          durationRows.map((row) => (
            <div
              key={row.key}
              className='settings-tab-content'
              onClick={() => onEditField(row.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 40,
                padding: '0 12px',
                borderRadius: 12,
                cursor: 'pointer',
                transition: 'background 100ms ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)')
              }
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font)' }}>
                {row.label}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  className='num'
                  style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}
                >
                  {String(row.value).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.unit}</span>
                <svg
                  width='12'
                  height='12'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='var(--text-muted)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  style={{ marginLeft: 2 }}
                >
                  <path d='M9 18l6-6-6-6' />
                </svg>
              </div>
            </div>
          ))}

        {/* ALERTAS */}
        {activeTab === 'notifications' && (
          <div
            className='settings-tab-content'
            style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}
          >
            <Row
              label='Sonido al finalizar'
              right={
                <Switch
                  checked={soundEnabled}
                  onChange={onToggleSound}
                  ariaLabel='Sonido al finalizar'
                />
              }
            />
            <Row
              label='Notificaciones de escritorio'
              right={
                <Switch
                  checked={notificationsEnabled}
                  onChange={onToggleNotifications}
                  ariaLabel='Notificaciones de escritorio'
                />
              }
            />
            <Row
              label='Iniciar siguiente fase auto.'
              right={
                <Switch
                  checked={autoStartNext}
                  onChange={onToggleAutoStart}
                  ariaLabel='Iniciar fase siguiente automáticamente'
                />
              }
            />
          </div>
        )}

        {/* SISTEMA */}
        {activeTab === 'system' && (
          <div
            className='settings-tab-content'
            style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}
          >
            <Row
              label='Siempre visible'
              right={
                <Switch
                  checked={alwaysOnTop}
                  onChange={onToggleAlwaysOnTop}
                  ariaLabel='Mantener siempre visible'
                />
              }
            />
            <Row
              label='Iniciar con Windows'
              right={
                <Switch
                  checked={autostart}
                  onChange={onToggleAutostart}
                  ariaLabel='Iniciar con Windows'
                />
              }
            />
            <Row
              label='Minimizar a bandeja al cerrar'
              right={
                <Switch
                  checked={minimizeToTray}
                  onChange={onToggleMinimizeToTray}
                  ariaLabel='Minimizar a la bandeja al cerrar'
                />
              }
            />
            <Row
              label='Modo compacto'
              right={
                <Switch checked={compact} onChange={onToggleCompact} ariaLabel='Modo compacto' />
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
