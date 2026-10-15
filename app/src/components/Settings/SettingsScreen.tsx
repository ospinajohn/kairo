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
const SETTINGS_ROW_HEIGHT = 40;

function Row({ label, right }: { label: string; right: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: SETTINGS_ROW_HEIGHT,
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

  // Navegación de pestañas con teclado (patrón ARIA tabs)
  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = tabs.length - 1;
    let next = index;
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    const target = tabs[next].id;
    setActiveTab(target);
    document.getElementById(`settings-tab-${target}`)?.focus();
  };

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
        role='tablist'
        aria-label='Secciones de ajustes'
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
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`settings-tab-${tab.id}`}
            type='button'
            role='tab'
            aria-selected={activeTab === tab.id}
            aria-controls={`settings-panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => handleTabKeyDown(e, index)}
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
        id={`settings-panel-${activeTab}`}
        role='tabpanel'
        aria-labelledby={`settings-tab-${activeTab}`}
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
            <button
              key={row.key}
              type='button'
              className='settings-tab-content'
              onClick={() => onEditField(row.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                height: SETTINGS_ROW_HEIGHT,
                padding: '0 12px',
                borderRadius: 12,
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 100ms ease',
                fontFamily: 'var(--font)',
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
            </button>
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
