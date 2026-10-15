// ============================================================
// Kairo — Hook usePreferences
// Persiste las preferencias de alertas en localStorage.
// Clave: "kairo-preferences" — formato JSON plano.
// Requisito: R-020 (persistencia de configuración)
// ============================================================

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'kairo-preferences';

export interface Preferences {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  autoStartNext: boolean;
}

export const DEFAULT_PREFERENCES: Preferences = {
  notificationsEnabled: true,
  soundEnabled: true,
  autoStartNext: false,
};

function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return {
      notificationsEnabled:
        parsed.notificationsEnabled ?? DEFAULT_PREFERENCES.notificationsEnabled,
      soundEnabled: parsed.soundEnabled ?? DEFAULT_PREFERENCES.soundEnabled,
      autoStartNext: parsed.autoStartNext ?? DEFAULT_PREFERENCES.autoStartNext,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function savePreferences(prefs: Preferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage puede fallar sin cuota — silenciar
  }
}

export interface UsePreferencesReturn {
  preferences: Preferences;
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
}

export function usePreferences(): UsePreferencesReturn {
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const setPreference = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  return { preferences, setPreference };
}
