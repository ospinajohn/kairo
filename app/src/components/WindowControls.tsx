// ============================================================
// Kairo — Barra de controles de ventana
// Mini-pill flotante con margen seguro respecto a la curvatura.
// Oculta en reposo; se revela con fade suave al posar el cursor
// en la zona superior derecha.
// ============================================================

import { useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function WindowControls() {
  const [hovered, setHovered] = useState<"close" | "min" | null>(null);

  const handleClose    = () => getCurrentWindow().close();
  const handleMinimize = () => getCurrentWindow().minimize();

  const btnBase: React.CSSProperties = {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    width:          18,
    height:         18,
    borderRadius:   "50%",
    border:         "none",
    background:     "transparent",
    cursor:         "pointer",
    padding:        0,
    transition:     "background 220ms ease-out, transform 220ms var(--ease-out)",
  };

  return (
    <div className="window-controls-zone" data-tauri-drag-region="false">
      <div className="window-controls-pill">
        {/* Minimizar */}
        <button
          onClick={(e) => { e.stopPropagation(); handleMinimize(); }}
          onMouseEnter={() => setHovered("min")}
          onMouseLeave={() => setHovered(null)}
          style={{
            ...btnBase,
            background: hovered === "min"
              ? "rgba(255,255,255,0.14)"
              : "transparent",
            transform: hovered === "min" ? "scale(1.04)" : "scale(1)",
          }}
          title="Minimizar"
          aria-label="Minimizar"
        >
          {/* Icono — */}
          <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
            <line x1="1" y1="1" x2="7" y2="1"
              stroke={hovered === "min" ? "#FFFFFF" : "rgba(255,255,255,0.7)"}
              strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Cerrar */}
        <button
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          onMouseEnter={() => setHovered("close")}
          onMouseLeave={() => setHovered(null)}
          style={{
            ...btnBase,
            background: hovered === "close"
              ? "rgba(229, 48, 26, 0.75)"
              : "transparent",
            transform: hovered === "close" ? "scale(1.04)" : "scale(1)",
          }}
          title="Cerrar"
          aria-label="Cerrar"
        >
          {/* Icono × */}
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <line x1="1.5" y1="1.5" x2="6.5" y2="6.5"
              stroke={hovered === "close" ? "#FFFFFF" : "rgba(255,255,255,0.7)"}
              strokeWidth="1.5" strokeLinecap="round" />
            <line x1="6.5" y1="1.5" x2="1.5" y2="6.5"
              stroke={hovered === "close" ? "#FFFFFF" : "rgba(255,255,255,0.7)"}
              strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
