// ============================================================
// Kairo — Gestión del ciclo Pomodoro
// Requisitos: R-004, R-009, R-010
// ============================================================

import type { Phase, TimerConfig } from "./config";

export interface CycleState {
  /** Fase activa en este momento. */
  currentPhase: Phase;
  /** Número de sesiones de concentración completadas en el ciclo actual (0-based). */
  completedSessions: number;
}

export const INITIAL_CYCLE: CycleState = {
  currentPhase:      "focus",
  completedSessions: 0,
};

/**
 * Calcula el siguiente estado del ciclo al terminar la fase actual.
 * No muta el estado — devuelve uno nuevo.
 *
 * Reglas (R-004):
 *   focus → completedSessions + 1
 *     si completedSessions + 1 >= longBreakAfter → long-break
 *     si no → short-break
 *   short-break → focus
 *   long-break  → focus, reinicia completedSessions a 0
 */
export function nextCycleState(
  state: CycleState,
  config: TimerConfig
): CycleState {
  switch (state.currentPhase) {
    case "focus": {
      const completed = state.completedSessions + 1;
      if (completed >= config.longBreakAfter) {
        return { currentPhase: "long-break", completedSessions: completed };
      }
      return { currentPhase: "short-break", completedSessions: completed };
    }
    case "short-break":
      return { ...state, currentPhase: "focus" };
    case "long-break":
      return { currentPhase: "focus", completedSessions: 0 };
  }
}

/**
 * Fuerza el salto a la siguiente fase sin completar la actual.
 * El conteo de sesiones sigue la misma lógica que al completar.
 */
export function skipPhase(
  state: CycleState,
  config: TimerConfig
): CycleState {
  return nextCycleState(state, config);
}
