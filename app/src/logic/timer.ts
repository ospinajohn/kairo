// ============================================================
// Kairo — Máquina de estados del temporizador
// Requisitos: R-001, R-002, R-003, R-005, R-006, R-007, R-008
// NF-001: precisión con Date.now() para evitar drift acumulado
// ============================================================

import { phaseDurationMs } from "./config";
import { nextCycleState, skipPhase } from "./cycle";
import type { TimerConfig, Phase } from "./config";
import type { CycleState } from "./cycle";

export type TimerStatus = "idle" | "running" | "paused" | "completed";

export interface TimerState {
  status: TimerStatus;
  /** Tiempo restante en milisegundos. */
  remainingMs: number;
  /** Duración total de la fase activa en milisegundos. */
  totalMs: number;
  cycle: CycleState;
}

// ── Estado inicial ────────────────────────────────────────────────────────────

export function createInitialState(config: TimerConfig): TimerState {
  const phase: Phase = "focus";
  const totalMs = phaseDurationMs(phase, config);
  return {
    status:      "idle",
    remainingMs: totalMs,
    totalMs,
    cycle: { currentPhase: phase, completedSessions: 0 },
  };
}

// ── Transiciones ──────────────────────────────────────────────────────────────

/** Inicia o reanuda el temporizador. */
export function startTimer(state: TimerState): TimerState {
  if (state.status === "running") return state;
  if (state.remainingMs <= 0)     return state;
  return { ...state, status: "running" };
}

/** Pausa el temporizador. */
export function pauseTimer(state: TimerState): TimerState {
  if (state.status !== "running") return state;
  return { ...state, status: "paused" };
}

/**
 * Aplica el tiempo transcurrido al temporizador.
 * Usa el tiempo real (Date.now) para evitar drift — NF-001.
 * Devuelve el nuevo estado; si llega a 0 marca status = "completed".
 */
export function tickTimer(state: TimerState, elapsedMs: number): TimerState {
  if (state.status !== "running") return state;
  const remaining = Math.max(0, state.remainingMs - elapsedMs);
  if (remaining === 0) {
    return { ...state, remainingMs: 0, status: "completed" };
  }
  return { ...state, remainingMs: remaining };
}

/**
 * Avanza a la siguiente fase del ciclo (R-007).
 * Puede llamarse desde cualquier estado.
 */
export function skipPhaseTimer(
  state: TimerState,
  config: TimerConfig
): TimerState {
  const newCycle = skipPhase(state.cycle, config);
  const totalMs  = phaseDurationMs(newCycle.currentPhase, config);
  return {
    status:      "idle",
    remainingMs: totalMs,
    totalMs,
    cycle:       newCycle,
  };
}

/**
 * Reinicia la fase actual desde el principio (R-008).
 * No altera el ciclo.
 */
export function resetPhase(
  state: TimerState,
  config: TimerConfig
): TimerState {
  const totalMs = phaseDurationMs(state.cycle.currentPhase, config);
  return {
    ...state,
    status:      "idle",
    remainingMs: totalMs,
    totalMs,
  };
}

/**
 * Avanza automáticamente al siguiente estado tras completar una fase (R-003).
 * Llamar solo cuando status === "completed".
 */
export function advancePhase(
  state: TimerState,
  config: TimerConfig
): TimerState {
  const newCycle = nextCycleState(state.cycle, config);
  const totalMs  = phaseDurationMs(newCycle.currentPhase, config);
  return {
    status:      "idle",
    remainingMs: totalMs,
    totalMs,
    cycle:       newCycle,
  };
}

// ── Utilidades ────────────────────────────────────────────────────────────────

/** Fracción transcurrida del temporizador: 0 (inicio) → 1 (completado). */
export function progress(state: TimerState): number {
  if (state.totalMs === 0) return 0;
  return 1 - state.remainingMs / state.totalMs;
}

/** Convierte milisegundos a { minutes, seconds }. */
export function msToTime(ms: number): { minutes: number; seconds: number } {
  const total = Math.ceil(ms / 1000);
  return { minutes: Math.floor(total / 60), seconds: total % 60 };
}
