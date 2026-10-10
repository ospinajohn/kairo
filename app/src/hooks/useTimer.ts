// ============================================================
// Kairo — Hook useTimer
// Conecta la lógica pura del temporizador con React.
// Requisitos: R-002, R-003, R-005, R-006, R-007, R-008
// NF-001: usa Date.now() como fuente de tiempo real (sin drift)
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_CONFIG } from "../logic/config";
import type { TimerConfig } from "../logic/config";
import {
  createInitialState,
  startTimer,
  pauseTimer,
  tickTimer,
  skipPhaseTimer,
  resetPhase,
  advancePhase,
  progress,
  msToTime,
} from "../logic/timer";
import type { TimerState } from "../logic/timer";

export interface UseTimerReturn {
  state:       TimerState;
  progress:    number;
  minutes:     number;
  seconds:     number;
  /** Timestamp (Date.now) de la última vez que el intervalo actualizó el estado.
   *  TimerRing lo usa para interpolar el progreso a 60fps sin esperar al próximo tick. */
  startedAt:   number | null;
  onStart:     () => void;
  onPause:     () => void;
  onResume:    () => void;
  onSkip:      () => void;
  onReset:     () => void;
}

export function useTimer(
  config: TimerConfig = DEFAULT_CONFIG,
  onPhaseComplete?: (state: TimerState) => void
): UseTimerReturn {
  const [state, setState] = useState<TimerState>(() =>
    createInitialState(config)
  );

  // Timestamp de la última actualización de estado (para interpolar en canvas a 60fps)
  const startedAtRef  = useRef<number | null>(null);
  const lastTickRef   = useRef<number | null>(null);

  // Cuando cambia la configuración en reposo, reiniciar el estado
  useEffect(() => {
    setState(prev => {
      if (prev.status === "idle") return createInitialState(config);
      return prev;
    });
  }, [config]);

  // Intervalo de 250ms: actualiza el estado de React (dígitos y progreso)
  // El canvas dibuja a 60fps interpolando entre estos snapshots (ver TimerRing).
  useEffect(() => {
    if (state.status !== "running") {
      lastTickRef.current  = null;
      startedAtRef.current = null;
      return;
    }

    // Marca el momento en que empieza este intervalo
    startedAtRef.current = Date.now();
    lastTickRef.current  = Date.now();

    const id = setInterval(() => {
      const now   = Date.now();
      const last  = lastTickRef.current ?? now;
      const delta = now - last;

      lastTickRef.current  = now;
      startedAtRef.current = now; // "resetear" el origen para la próxima ventana

      if (delta > 0) {
        setState(prev => {
          const next = tickTimer(prev, delta);
          if (next.status === "completed") {
            onPhaseComplete?.(next);
          }
          return next;
        });
      }
    }, 250);

    return () => clearInterval(id);
  }, [state.status, onPhaseComplete]);

  // Auto-avanzar a la siguiente fase cuando se completa (R-003)
  useEffect(() => {
    if (state.status === "completed") {
      const timer = setTimeout(() => {
        setState(prev => advancePhase(prev, config));
      }, 800); // pausa visual para mostrar el pulso de fin de fase
      return () => clearTimeout(timer);
    }
  }, [state.status, config]);

  const onStart  = useCallback(() => setState(s => startTimer(s)), []);
  const onPause  = useCallback(() => setState(s => pauseTimer(s)), []);
  const onResume = useCallback(() => setState(s => startTimer(s)), []);
  const onSkip   = useCallback(() => setState(s => skipPhaseTimer(s, config)), [config]);
  const onReset  = useCallback(() => setState(s => resetPhase(s, config)), [config]);

  const { minutes, seconds } = msToTime(state.remainingMs);

  return {
    state,
    progress:  progress(state),
    minutes,
    seconds,
    startedAt: startedAtRef.current,
    onStart,
    onPause,
    onResume,
    onSkip,
    onReset,
  };
}
