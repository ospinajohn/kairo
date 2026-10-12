// ============================================================
// Kairo — Hook useConfig
// Requisitos: R-020, R-021
// Persiste la configuración del usuario en localStorage.
// Clave: "kairo-config" — formato JSON plano.
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { DEFAULT_CONFIG, clampConfigValue } from "../logic/config";
import type { TimerConfig } from "../logic/config";

const STORAGE_KEY = "kairo-config";

/** Lee la config guardada. Si no existe o está corrupta, devuelve DEFAULT_CONFIG. */
function loadConfig(): TimerConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as Partial<TimerConfig>;
    // Validar y sanear cada campo con clampConfigValue
    return {
      focusDuration:      clampConfigValue("focusDuration",      parsed.focusDuration      ?? DEFAULT_CONFIG.focusDuration),
      shortBreakDuration: clampConfigValue("shortBreakDuration", parsed.shortBreakDuration ?? DEFAULT_CONFIG.shortBreakDuration),
      longBreakDuration:  clampConfigValue("longBreakDuration",  parsed.longBreakDuration  ?? DEFAULT_CONFIG.longBreakDuration),
      longBreakAfter:     clampConfigValue("longBreakAfter",     parsed.longBreakAfter     ?? DEFAULT_CONFIG.longBreakAfter),
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

/** Guarda la config en localStorage. */
function saveConfig(config: TimerConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // localStorage puede fallar en contextos sin cuota — silenciar el error
  }
}

export interface UseConfigReturn {
  config:    TimerConfig;
  setField:  (key: keyof TimerConfig, value: number) => void;
  resetConfig: () => void;
}

export function useConfig(): UseConfigReturn {
  const [config, setConfig] = useState<TimerConfig>(loadConfig);

  // Persistir cada vez que cambie la config (R-020)
  useEffect(() => {
    saveConfig(config);
  }, [config]);

  // Actualizar un campo concreto con validación de rango (R-011–R-014)
  const setField = useCallback((key: keyof TimerConfig, value: number) => {
    setConfig(prev => ({
      ...prev,
      [key]: clampConfigValue(key, value),
    }));
  }, []);

  // Restaurar defaults
  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, []);

  return { config, setField, resetConfig };
}
