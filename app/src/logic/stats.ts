// ============================================================
// Kairo — Tipos y esquema de estadísticas
// Requisito: R-107 (PRO-03)
// ============================================================

export interface Session {
  id:         number;
  phase:      "focus" | "short-break" | "long-break";
  durationMs: number;   // duración real completada
  completedAt: string;  // ISO 8601 UTC
}

export interface DayStat {
  date:         string;  // YYYY-MM-DD
  focusSessions: number;
  focusMinutes:  number;
}

export interface WeekStats {
  days:          DayStat[];
  totalSessions: number;
  totalMinutes:  number;
  streak:        number;  // días consecutivos con al menos 1 sesión
}

/** SQL para crear las tablas si no existen */
export const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS sessions (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    phase        TEXT    NOT NULL CHECK(phase IN ('focus','short-break','long-break')),
    duration_ms  INTEGER NOT NULL,
    completed_at TEXT    NOT NULL
  );
`;
