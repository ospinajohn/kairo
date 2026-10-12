// ============================================================
// Kairo — Hook useNotification
// Requisitos: R-022, R-023, R-024
// Envía una notificación Toast nativa de Windows al terminar
// cada fase. Respeta la preferencia del usuario (enabled).
// ============================================================

import { useCallback, useEffect, useRef } from "react";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import type { TimerState } from "../logic/timer";
import type { Phase } from "../logic/config";

// Mapa de términos (docs/product.md — Terminología de la interfaz)
const PHASE_NAMES: Record<Phase, string> = {
  "focus":       "Concentración",
  "short-break": "Descanso corto",
  "long-break":  "Descanso largo",
};

// Fase siguiente para el mensaje de la notificación (R-024)
function nextPhaseName(completedPhase: Phase, completedSessions: number, longBreakAfter: number): string {
  if (completedPhase === "focus") {
    return completedSessions >= longBreakAfter
      ? PHASE_NAMES["long-break"]
      : PHASE_NAMES["short-break"];
  }
  return PHASE_NAMES["focus"];
}

export function useNotification(enabled: boolean, longBreakAfter: number) {
  // Cache del permiso para no pedirlo cada vez
  const permissionRef = useRef<boolean | null>(null);

  // Solicitar permiso al montar si las notificaciones están habilitadas
  useEffect(() => {
    if (!enabled) return;
    isPermissionGranted().then(granted => {
      permissionRef.current = granted;
      if (!granted) {
        requestPermission().then(result => {
          permissionRef.current = result === "granted";
        });
      }
    });
  }, [enabled]);

  const notify = useCallback(async (completedState: TimerState) => {
    if (!enabled) return;

    // Verificar permiso (puede haber cambiado desde el montaje)
    if (permissionRef.current === null) {
      permissionRef.current = await isPermissionGranted();
    }
    if (!permissionRef.current) return;

    const phase    = completedState.cycle.currentPhase;
    const sessions = completedState.cycle.completedSessions;
    const next     = nextPhaseName(phase, sessions, longBreakAfter);

    sendNotification({
      title: "Kairo",
      body:  `${PHASE_NAMES[phase]} terminada. Siguiente: ${next}.`,
    });
  }, [enabled, longBreakAfter]);

  return { notify };
}
