// ============================================================
// Kairo — Pantalla de Estadísticas
// Requisito: R-107 (PRO-03), R-109 (PRO-09)
// Fuente visual: docs/design.md §2 (misma paleta y tipografía)
// ============================================================

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
  const maxSessions = stats ? Math.max(...stats.days.map((d) => d.focusSessions), 1) : 1;

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
          gap: 16,
        }}
      >
        {error && (
          <div
            role='alert'
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255, 179, 71, 0.28)',
              background: 'rgba(255, 179, 71, 0.08)',
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
                  color: 'var(--text)',
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
        <div>
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
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 6,
              marginTop: 8,
              height: 60,
            }}
          >
            {(stats?.days ?? []).map((day) => {
              const pct = day.focusSessions / maxSessions;
              const height = Math.max(pct * 52, day.focusSessions > 0 ? 4 : 2);
              const dow = new Date(day.date + 'T12:00:00').getDay();
              const isToday = day.date === new Date().toISOString().slice(0, 10);
              return (
                <div
                  key={day.date}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                  }}
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
                      animationDelay: `${(stats?.days.indexOf(day) ?? 0) * 35}ms`,
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Botones exportar/importar */}
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <button
            className='interactive-control'
            type='button'
            onClick={() => onExport('json')}
            style={btnStyle}
          >
            Exportar JSON
          </button>
          <button
            className='interactive-control'
            type='button'
            onClick={() => onExport('csv')}
            style={btnStyle}
          >
            Exportar CSV
          </button>
          <button
            className='interactive-control'
            type='button'
            onClick={onImport}
            style={{ ...btnStyle, color: 'var(--text-muted)' }}
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
  outline: 'none',
  fontFamily: 'var(--font)',
  transition: 'background 120ms ease',
};
