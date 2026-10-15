// ============================================================
// Kairo — Hook useVisibilityPause
// Pausa animaciones decorativas cuando la ventana no está visible.
// La skill UI/UX señala que las animaciones infinitas son
// distracción y deben pausarse cuando no son visibles.
// ============================================================

import { useEffect } from "react";

export function useVisibilityPause(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function handleVisibility() {
      if (!el) return;
      if (document.hidden) {
        el.classList.add("animation-paused");
      } else {
        el.classList.remove("animation-paused");
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [containerRef]);
}
