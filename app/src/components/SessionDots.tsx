// ============================================================
// Kairo — Indicador de sesiones completadas
// Requisitos: R-009, R-010
// Fuente visual: docs/design.md §7.1
// ============================================================

interface SessionDotsProps {
  total:     number;   // longBreakAfter (ej. 4)
  completed: number;   // sesiones completadas en el ciclo actual
  running:   boolean;  // la sesión actual está en curso
}

export function SessionDots({ total, completed, running }: SessionDotsProps) {
  return (
    <div
      style={{ display: "flex", gap: 4, alignItems: "center" }}
      role="img"
      aria-label={`${completed} de ${total} sesiones completadas`}
    >
      {Array.from({ length: total }, (_, i) => {
        const isDone    = i < completed;
        const isCurrent = i === completed && running;
        return (
          <div
            key={i}
            style={{
              width:        3,
              height:       8,
              borderRadius: 9999,
              backgroundColor: isDone ? "var(--accent)" : "var(--track)",
              opacity: isCurrent ? undefined : 1,
              animation: isCurrent ? "blink-pause 2s ease-in-out infinite" : undefined,
              transition: "background-color 300ms ease",
            }}
          />
        );
      })}
    </div>
  );
}
