// ============================================================
// Kairo — Editor de valor numérico
// Fuente visual: docs/design.md §7.3
// Botones [ - ] y [ + ]: 36x36px, radio 11px, borde casi blanco, sin relleno
// Número: 44px, peso 400. Unidad debajo: 12px, --text-muted
// Botón volver: círculo 40px, borde 1px --border, ícono ‹
// ============================================================

import { useEffect, useRef } from 'react';

interface ValueEditorProps {
  title: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  onBack: () => void;
}

export function ValueEditor({
  title,
  value,
  unit,
  min,
  max,
  step,
  onChange,
  onBack,
}: ValueEditorProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const canDecrease = value > min;
  const canIncrease = value < max;

  const handleDecrease = () => {
    if (value > min) {
      onChange(Math.max(min, value - step));
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(Math.min(max, value + step));
    }
  };

  // Mantener presionado para acelerar
  const startLongPress = (action: () => void) => {
    action();
    timerRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        action();
      }, 120);
    }, 350);
  };

  const stopLongPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    return () => stopLongPress();
  }, []);

  const numBtnStyle = (enabled: boolean): React.CSSProperties => ({
    width: 36,
    height: 36,
    borderRadius: 11,
    border: '1px solid rgba(217, 217, 220, 0.85)',
    background: 'transparent',
    color: 'var(--text)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: enabled ? 'pointer' : 'default',
    opacity: enabled ? 1 : 0.35,
    userSelect: 'none',
    outline: 'none',
    transition: 'background 100ms ease, transform 90ms ease, opacity 150ms ease',
  });

  return (
    <div
      className='screen-enter-right'
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '0 20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Botón Volver — círculo 40px en top: 24px, left: 24px */}
      <button
        className='interactive-control'
        onClick={onBack}
        aria-label='Volver a ajustes'
        style={{
          position: 'absolute',
          top: 24,
          left: 20,
          width: 40,
          height: 40,
          borderRadius: 9999,
          background: 'transparent',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          outline: 'none',
          transition: 'background 120ms ease, transform 90ms ease',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
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
        >
          <path d='M15 18l-6-6 6-6' />
        </svg>
      </button>

      {/* Título — centrado a ~31% del alto (top: 88px) */}
      <div
        style={{
          position: 'absolute',
          top: 86,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 400,
          color: 'var(--text)',
          fontFamily: 'var(--font)',
        }}
      >
        {title}
      </div>

      {/* Selector numérico — centrado en ~50% (top: 150px) */}
      <div
        style={{
          position: 'absolute',
          top: 145,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
        }}
      >
        {/* Botón [-] */}
        <button
          style={numBtnStyle(canDecrease)}
          disabled={!canDecrease}
          onMouseDown={() => canDecrease && startLongPress(handleDecrease)}
          onMouseUp={stopLongPress}
          onMouseLeave={stopLongPress}
          aria-label='Disminuir valor'
        >
          <svg
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
          >
            <line x1='5' y1='12' x2='19' y2='12' />
          </svg>
        </button>

        {/* Número */}
        <span
          className='num'
          style={{
            fontSize: 44,
            fontWeight: 400,
            color: 'var(--text)',
            fontFamily: 'var(--font)',
            minWidth: 60,
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          {String(value).padStart(2, '0')}
        </span>

        {/* Botón [+] */}
        <button
          style={numBtnStyle(canIncrease)}
          disabled={!canIncrease}
          onMouseDown={() => canIncrease && startLongPress(handleIncrease)}
          onMouseUp={stopLongPress}
          onMouseLeave={stopLongPress}
          aria-label='Aumentar valor'
        >
          <svg
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
          >
            <line x1='12' y1='5' x2='12' y2='19' />
            <line x1='5' y1='12' x2='19' y2='12' />
          </svg>
        </button>
      </div>

      {/* Unidad — centrada bajo el número (top: 205px) */}
      <div
        style={{
          position: 'absolute',
          top: 205,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 400,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font)',
        }}
      >
        {unit}
      </div>
    </div>
  );
}
