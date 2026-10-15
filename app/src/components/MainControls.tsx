// ============================================================
// Kairo — Controles principales
// Fuente visual: docs/design.md §7.1 "Botones inferiores"
//   - Círculos: 44px, borde 1px --border, sin relleno
//   - Pill central: 107x40px, relleno --surface-3
//   - Separación: círculos a ~14% de los bordes, pill centrado
// ============================================================

import type { TimerStatus } from '../logic/timer';

interface MainControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSettings: () => void;
  onStats?: () => void;
}

function ResetIcon() {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' />
      <path d='M3 3v5h5' />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='3' />
      <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' />
    </svg>
  );
}

function primaryLabel(status: TimerStatus): string {
  if (status === 'running') return 'PAUSAR';
  if (status === 'paused') return 'REANUDAR';
  return 'INICIAR';
}

export function MainControls({
  status,
  onStart,
  onPause,
  onResume,
  onReset,
  onSettings,
  onStats,
}: MainControlsProps) {
  const handlePrimary = status === 'running' ? onPause : status === 'paused' ? onResume : onStart;

  const circleBtn: React.CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: 9999,
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition:
      'color 160ms ease, background-color 160ms ease, border-color 160ms ease, box-shadow 180ms ease, transform 160ms var(--ease-out)',
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        width: '100%',
        padding: '0 26px',
        gap: 'var(--space-3)',
      }}
    >
      {/* Botón reiniciar */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button
          className='interactive-control'
          style={circleBtn}
          onClick={onReset}
          aria-label='Reiniciar fase'
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.96)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ResetIcon />
        </button>
      </div>

      {/* Pill central — 107x40px */}
      <button
        className='interactive-control control-primary'
        data-action={status === 'running' ? 'pause' : status === 'paused' ? 'resume' : 'start'}
        style={{
          width: 108,
          height: 'var(--control-height)',
          borderRadius: 9999,
          background: 'var(--surface-3)',
          color: 'var(--text)',
          border: 'none',
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.14em',
          fontFamily: 'var(--font)',
          cursor: 'pointer',
          transition:
            'background 160ms ease, box-shadow 180ms ease, transform 160ms var(--ease-out)',
          flexShrink: 0,
        }}
        onClick={handlePrimary}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--surface-3-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--surface-3)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.96)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {primaryLabel(status)}
      </button>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        {onStats && (
          <button
            className='interactive-control'
            style={{ ...circleBtn, position: 'relative' }}
            onClick={onStats}
            aria-label='Ver estadísticas'
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.96)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='18' y1='20' x2='18' y2='10' />
              <line x1='12' y1='20' x2='12' y2='4' />
              <line x1='6' y1='20' x2='6' y2='14' />
            </svg>
          </button>
        )}
        <button
          className='interactive-control'
          style={circleBtn}
          onClick={onSettings}
          aria-label='Abrir ajustes'
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.96)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <GearIcon />
        </button>
      </div>
    </div>
  );
}
