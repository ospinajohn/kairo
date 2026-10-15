// ============================================================
// Kairo — Pantalla de Estadísticas
// Requisito: R-107 (PRO-03), R-109 (PRO-09)
// UI/UX: estado vacío con mensaje, tooltips en barras,
//        animaciones escalonadas, focus rings accesibles.
// ============================================================

import { useState } from 'react';
import type { WeekStats } from '../../logic/stats';

interface StatsScreenProps {
  stats: WeekStats | null;
  error?: string | null;
  onClose: () => void;
  onExport: (format: 'json' | 'csv') => void;
  onImport: () => void;
}

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function StatsScreen({ stats, error, onClose, onExport, onImport }: StatsScreenProps) {
  const [tooltip, setTooltip] = useState<{ day: string; sessions: number; minutes: number } | null>(
    null,
  );

  const maxSessions = stats ? Math.max(...stats.days.map((d) => d.focusSessions), 1) : 1;
  const hasData = stats ? stats.totalSessions > 0 : false;

  return (
    <div
      className='screen-enter-up'
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
          Estadísticas
        </span>
      </div>

      {/* Contenido */}
      <div
        style={{
          position: 'absolute',
          top: 72,
          left: 20,
          right: 20,
          bottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* Error */}
        {error && (
          <div
            role='alert'
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,179,71,0.28)',
              background: 'rgba(255,179,71,0.08)',
              color: 'var(--accent-head)',
              fontSize: 11,
              lineHeight: 1.4,
            }}
          >
            {error}
          </div>
        )}

        {/* Resumen numérico */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'Sesiones', value: stats?.totalSessions ?? 0 },
            { label: 'Minutos', value: stats?.totalMinutes ?? 0 },
            { label: 'Racha', value: stats?.streak ?? 0, suffix: 'd' },
          ].map((item) => (
            <div
              key={item.label}
              className='metric-card'
              style={{
                flex: 1,
                borderRadius: 12,
                backgroundColor: 'var(--surface-1)',
                border: '1px solid var(--border-subtle)',
                padding: '10px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <span
                className='num'
                style={{
                  fontSize: 22,
                  fontWeight: 400,
                  color: hasData ? 'var(--text)' : 'var(--text-muted)',
                  lineHeight: 1,
                }}
              >
                {item.value}
                {item.suffix ?? ''}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Gráfico de barras semanal */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: '0.18em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            Últimos 7 días
          </span>

          {/* Tooltip */}
          {tooltip && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 10,
                color: 'var(--text)',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                zIndex: 10,
              }}
            >
              {tooltip.day} · {tooltip.sessions} {tooltip.sessions === 1 ? 'sesión' : 'sesiones'} ·{' '}
              {tooltip.minutes} min
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 6,
              marginTop: 8,
              height: 56,
            }}
          >
            {(
              stats?.days ??
              Array.from(
                { length: 7 },
                () =>
                  ({
                    date: '',
                    focusSessions: 0,
                    focusMinutes: 0,
                    _skeleton: true,
                  }) as any,
              )
            ).map((day, i) => {
              const pct = day.focusSessions / maxSessions;
              const height = Math.max(pct * 48, day.focusSessions > 0 ? 4 : 2);
              const dow = day.date ? new Date(day.date + 'T12:00:00').getDay() : i;
              const isToday = day.date === new Date().toISOString().slice(0, 10);
              return (
                <button
                  type='button'
                  key={day.date || i}
                  aria-label={
                    day.date
                      ? `${DAYS_ES[dow]}: ${day.focusSessions} ${day.focusSessions === 1 ? 'sesión' : 'sesiones'}, ${day.focusMinutes} minutos`
                      : `Día ${i + 1}: sin datos`
                  }
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'pointer',
                    border: 0,
                    padding: 0,
                    background: 'transparent',
                    color: 'inherit',
                    font: 'inherit',
                  }}
                  onMouseEnter={() =>
                    day.date &&
                    setTooltip({
                      day: DAYS_ES[dow],
                      sessions: day.focusSessions,
                      minutes: day.focusMinutes,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                  onFocus={() =>
                    day.date &&
                    setTooltip({
                      day: DAYS_ES[dow],
                      sessions: day.focusSessions,
                      minutes: day.focusMinutes,
                    })
                  }
                  onBlur={() => setTooltip(null)}
                >
                  <div
                    className='weekly-bar'
                    style={{
                      width: '100%',
                      height,
                      borderRadius: 4,
                      background:
                        day.focusSessions > 0
                          ? 'linear-gradient(180deg, #FF7A3D 0%, #E5301A 100%)'
                          : 'var(--track)',
                      opacity: isToday ? 1 : 0.75,
                      transition: 'height 400ms ease',
                      animationDelay: `${i * 35}ms`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 9,
                      color: isToday ? 'var(--accent)' : 'var(--text-muted)',
                      fontWeight: isToday ? 600 : 400,
                    }}
                  >
                    {DAYS_ES[dow]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Estado vacío */}
          {!hasData && !error && (
            <div
              style={{
                marginTop: 6,
                textAlign: 'center',
                fontSize: 10,
                color: 'var(--text-muted)',
                lineHeight: 1.5,
              }}
            >
              Completa tu primera sesión para ver estadísticas
            </div>
          )}
        </div>

        {/* Botones exportar/importar */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className='interactive-control'
            type='button'
            onClick={() => onExport('json')}
            style={btnStyle}
            aria-label='Exportar estadísticas como JSON'
          >
            JSON
          </button>
          <button
            className='interactive-control'
            type='button'
            onClick={() => onExport('csv')}
            style={btnStyle}
            aria-label='Exportar estadísticas como CSV'
          >
            CSV
          </button>
          <button
            className='interactive-control'
            type='button'
            onClick={onImport}
            style={{ ...btnStyle, color: 'var(--text-muted)', flex: 1.5 }}
            aria-label='Importar estadísticas desde archivo'
          >
            Importar
          </button>
        </div>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  flex: 1,
  height: 32,
  borderRadius: 9999,
  backgroundColor: 'var(--surface-2)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.08em',
  cursor: 'pointer',
  fontFamily: 'var(--font)',
  transition: 'background 120ms ease',
};
