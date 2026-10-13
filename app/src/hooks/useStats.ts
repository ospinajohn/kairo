// ============================================================
// Kairo — Hook useStats
// Requisito: R-107 (PRO-03), R-109 (PRO-09)
// Gestiona la base de datos SQLite de sesiones completadas.
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import Database from '@tauri-apps/plugin-sql';
import { CREATE_TABLES_SQL } from '../logic/stats';
import type { DayStat, WeekStats } from '../logic/stats';

const DB_PATH = 'sqlite:kairo.db';

// ── Utilidades ────────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function last7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function calcStreak(days: DayStat[]): number {
  // Contar días consecutivos hacia atrás desde hoy con al menos 1 sesión
  const today = todayISO();
  let streak = 0;
  let cursor = new Date(today);
  const dayMap = new Map(days.map((d) => [d.date, d]));

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (dayMap.has(key) && dayMap.get(key)!.focusSessions > 0) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseStatsReturn {
  weekStats: WeekStats | null;
  statsError: string | null;
  recordSession: (
    phase: 'focus' | 'short-break' | 'long-break',
    durationMs: number,
  ) => Promise<void>;
  exportJSON: () => Promise<string>;
  exportCSV: () => Promise<string>;
  importJSON: (json: string) => Promise<void>;
  refreshStats: () => Promise<void>;
}

export function useStats(): UseStatsReturn {
  const dbRef = useRef<Database | null>(null);
  const [weekStats, setWeekStats] = useState<WeekStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Inicializar DB al montar
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const db = await Database.load(DB_PATH);
        await db.execute(CREATE_TABLES_SQL);
        dbRef.current = db;
        if (mounted) {
          await loadWeekStats(db);
          setStatsError(null);
        }
      } catch (e) {
        console.error('Error al inicializar la base de datos:', e);
        if (mounted) setStatsError('No se pudieron cargar las estadísticas.');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function loadWeekStats(db: Database) {
    const days = last7Days();
    const from = days[0];
    const to = days[days.length - 1];

    const rows = await db.select<{ date: string; sessions: number; minutes: number }[]>(
      `
      SELECT
        substr(completed_at, 1, 10)         AS date,
        COUNT(*)                             AS sessions,
        ROUND(SUM(duration_ms) / 60000.0)   AS minutes
      FROM sessions
      WHERE phase = 'focus'
        AND substr(completed_at, 1, 10) BETWEEN $1 AND $2
      GROUP BY date
    `,
      [from, to],
    );

    const dayMap = new Map(rows.map((r) => [r.date, r]));
    const dayStats: DayStat[] = days.map((d) => ({
      date: d,
      focusSessions: dayMap.get(d)?.sessions ?? 0,
      focusMinutes: dayMap.get(d)?.minutes ?? 0,
    }));

    const totalSessions = dayStats.reduce((s, d) => s + d.focusSessions, 0);
    const totalMinutes = dayStats.reduce((s, d) => s + d.focusMinutes, 0);
    const streak = calcStreak(dayStats);

    setWeekStats({ days: dayStats, totalSessions, totalMinutes, streak });
  }

  const refreshStats = useCallback(async () => {
    if (dbRef.current) await loadWeekStats(dbRef.current);
  }, []);

  // Registrar una sesión completada
  const recordSession = useCallback(
    async (phase: 'focus' | 'short-break' | 'long-break', durationMs: number) => {
      const db = dbRef.current;
      if (!db) return;
      await db.execute(
        'INSERT INTO sessions (phase, duration_ms, completed_at) VALUES ($1, $2, $3)',
        [phase, durationMs, new Date().toISOString()],
      );
      if (phase === 'focus') await loadWeekStats(db);
    },
    [],
  );

  // Exportar todas las sesiones como JSON
  const exportJSON = useCallback(async (): Promise<string> => {
    const db = dbRef.current;
    if (!db) return '[]';
    const rows = await db.select<
      {
        id: number;
        phase: string;
        duration_ms: number;
        completed_at: string;
      }[]
    >('SELECT * FROM sessions ORDER BY completed_at');
    return JSON.stringify(rows, null, 2);
  }, []);

  // Exportar como CSV
  const exportCSV = useCallback(async (): Promise<string> => {
    const db = dbRef.current;
    if (!db) return '';
    const rows = await db.select<
      {
        id: number;
        phase: string;
        duration_ms: number;
        completed_at: string;
      }[]
    >('SELECT * FROM sessions ORDER BY completed_at');
    const header = 'id,phase,duration_ms,completed_at';
    const lines = rows.map((r) => `${r.id},${r.phase},${r.duration_ms},${r.completed_at}`);
    return [header, ...lines].join('\n');
  }, []);

  // Importar desde JSON (añade sin duplicar)
  const importJSON = useCallback(async (json: string) => {
    const db = dbRef.current;
    if (!db) return;
    const rows = JSON.parse(json) as {
      phase: string;
      duration_ms: number;
      completed_at: string;
    }[];
    for (const row of rows) {
      await db.execute(
        'INSERT OR IGNORE INTO sessions (phase, duration_ms, completed_at) VALUES ($1, $2, $3)',
        [row.phase, row.duration_ms, row.completed_at],
      );
    }
    await loadWeekStats(db);
  }, []);

  return { weekStats, statsError, recordSession, exportJSON, exportCSV, importJSON, refreshStats };
}
