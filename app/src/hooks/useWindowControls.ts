// ============================================================
// Kairo — Hook useWindowControls
// Requisitos: R-101, R-102, R-103, R-105
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { getCurrentWindow }                 from "@tauri-apps/api/window";
import { emit }                             from "@tauri-apps/api/event";
import { enable, disable, isEnabled }       from "@tauri-apps/plugin-autostart";

const STORAGE_KEY_TRAY = "kairo-minimize-to-tray";

export interface UseWindowControlsReturn {
  alwaysOnTop:        boolean;
  autostart:          boolean;
  minimizeToTray:     boolean;
  toggleAlwaysOnTop:  () => Promise<void>;
  toggleAutostart:    () => Promise<void>;
  toggleMinimizeToTray: () => void;
}

export function useWindowControls(): UseWindowControlsReturn {
  const [alwaysOnTop,    setAlwaysOnTop]    = useState(false);
  const [autostart,      setAutostart]      = useState(false);
  const [minimizeToTray, setMinimizeToTray] = useState(
    () => localStorage.getItem(STORAGE_KEY_TRAY) !== "false" // default: true
  );

  // Leer estado inicial de autostart al montar
  useEffect(() => {
    isEnabled().then(setAutostart).catch(() => setAutostart(false));
  }, []);

  // Sincronizar minimizeToTray con el backend cada vez que cambie
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRAY, String(minimizeToTray));
    // Notificar al backend Rust para que sepa cómo manejar el cierre
    emit("minimize-to-tray-changed", { enabled: minimizeToTray }).catch(() => {});
  }, [minimizeToTray]);

  const toggleAlwaysOnTop = useCallback(async () => {
    const next = !alwaysOnTop;
    await getCurrentWindow().setAlwaysOnTop(next);
    setAlwaysOnTop(next);
  }, [alwaysOnTop]);

  const toggleAutostart = useCallback(async () => {
    if (autostart) {
      await disable();
      setAutostart(false);
    } else {
      await enable();
      setAutostart(true);
    }
  }, [autostart]);

  const toggleMinimizeToTray = useCallback(() => {
    setMinimizeToTray(prev => !prev);
  }, []);

  return {
    alwaysOnTop,
    autostart,
    minimizeToTray,
    toggleAlwaysOnTop,
    toggleAutostart,
    toggleMinimizeToTray,
  };
}
