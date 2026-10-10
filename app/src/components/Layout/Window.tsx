// ============================================================
// Kairo — Contenedor principal de la ventana
// Requisitos: R-024, R-025, R-026
// Fuente visual: docs/design.md §3, §7.1
// ============================================================

import type { ReactNode } from "react";

interface WindowProps {
  ring:     ReactNode;   // anillo + overlay (centrado en 42%)
  controls: ReactNode;   // botones inferiores (en 86%)
}

export function Window({ ring, controls }: WindowProps) {
  return (
    <div style={{ padding: 16, background: "transparent", width: "fit-content" }}>
      <div
        data-tauri-drag-region
        style={{
          position:     "relative",
          width:        320,
          height:       320,
          borderRadius: 54,
          backgroundColor: "var(--bg)",
          backgroundImage:
            "radial-gradient(90% 90% at 50% 100%, rgba(120,25,10,0.18) 0%, rgba(0,0,0,0) 70%)",
          border:    "1px solid var(--border-subtle)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.40)",
          overflow:  "hidden",
          userSelect: "none",
          cursor:    "default",
        }}
        role="application"
        aria-label="Kairo temporizador Pomodoro"
      >
        {/* Anillo: centrado horizontalmente, 42% desde arriba = 134px */}
        <div style={{
          position:  "absolute",
          top:       134,
          left:      "50%",
          transform: "translate(-50%, -50%)",
        }}>
          {ring}
        </div>

        {/* Botones: 86% desde arriba = 275px → bottom 45px */}
        <div style={{
          position:       "absolute",
          bottom:         32,
          left:           0,
          right:          0,
          display:        "flex",
          justifyContent: "center",
        }}>
          {controls}
        </div>
      </div>
    </div>
  );
}
