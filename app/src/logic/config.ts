// ============================================================
// Kairo — Configuración del temporizador
// Requisitos: R-011, R-012, R-013, R-014
// ============================================================

export type Phase = "focus" | "short-break" | "long-break";

export interface TimerConfig {
  /** Duración de la fase Concentración en minutos. Rango: 1–120. Default: 25. */
  focusDuration: number;
  /** Duración del Descanso corto en minutos. Rango: 1–30. Default: 5. */
  shortBreakDuration: number;
  /** Duración del Descanso largo en minutos. Rango: 5–60. Default: 15. */
  longBreakDuration: number;
  /** Sesiones de concentración antes del descanso largo. Rango: 2–12. Default: 4. */
  longBreakAfter: number;
}

export const DEFAULT_CONFIG: TimerConfig = {
  focusDuration:       25,
  shortBreakDuration:  5,
  longBreakDuration:   15,
  longBreakAfter:      4,
};

export const CONFIG_RANGES = {
  focusDuration:       { min: 1,  max: 120, step: 1  },
  shortBreakDuration:  { min: 1,  max: 30,  step: 1  },
  longBreakDuration:   { min: 5,  max: 60,  step: 5  },
  longBreakAfter:      { min: 2,  max: 12,  step: 1  },
} as const;

/** Devuelve el valor limitado al rango de una clave de configuración. */
export function clampConfigValue(
  key: keyof TimerConfig,
  value: number
): number {
  const { min, max } = CONFIG_RANGES[key];
  return Math.min(max, Math.max(min, value));
}

/** Devuelve la duración en milisegundos de una fase según la configuración. */
export function phaseDurationMs(phase: Phase, config: TimerConfig): number {
  switch (phase) {
    case "focus":       return config.focusDuration      * 60_000;
    case "short-break": return config.shortBreakDuration * 60_000;
    case "long-break":  return config.longBreakDuration  * 60_000;
  }
}
