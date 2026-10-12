// ============================================================
// Kairo — Hook useSound
// Requisito: R-108 (PRO-08)
// Reproduce un sonido suave al terminar cada fase.
// Usa Web Audio API para generar el tono localmente,
// sin archivos de audio externos.
// ============================================================

import { useCallback } from "react";

/** Genera un tono suave tipo "ding" con Web Audio API. */
function playDing() {
  try {
    const ctx  = new AudioContext();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type      = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);           // La5
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4); // La4

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);

    osc.onended = () => ctx.close();
  } catch {
    // Silenciar errores en contextos sin audio
  }
}

export function useSound(enabled: boolean) {
  const play = useCallback(() => {
    if (enabled) playDing();
  }, [enabled]);

  return { play };
}
