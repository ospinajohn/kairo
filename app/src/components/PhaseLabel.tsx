// ============================================================
// Kairo — Ícono e etiqueta de fase
// Requisitos: R-001, R-029
// Fuente visual: docs/design.md §6, §7.1
// ============================================================

import type { Phase } from "../logic/config";

interface PhaseLabelProps {
  phase: Phase;
}

// Íconos SVG inline (Lucide style, strokeWidth 1.5, 20px)
function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function CupIcon({ lines = 2 }: { lines?: number }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      {lines >= 1 && <line x1="6" y1="1" x2="6" y2="4"/>}
      {lines >= 2 && <line x1="10" y1="1" x2="10" y2="4"/>}
      {lines >= 3 && <line x1="14" y1="1" x2="14" y2="4"/>}
    </svg>
  );
}

// Mapa de términos (docs/product.md — Terminología de la interfaz)
const PHASE_LABELS: Record<Phase, string> = {
  "focus":       "CONCENTRACIÓN",
  "short-break": "DESCANSO CORTO",
  "long-break":  "DESCANSO LARGO",
};

export function PhaseIcon({ phase }: PhaseLabelProps) {
  if (phase === "focus")       return <EyeIcon />;
  if (phase === "short-break") return <CupIcon lines={2} />;
  return <CupIcon lines={3} />;
}

export function PhaseLabel({ phase }: PhaseLabelProps) {
  return (
    <span className="label" style={{ letterSpacing: "0.22em" }}>
      {PHASE_LABELS[phase]}
    </span>
  );
}
