// ============================================================
// Kairo — Pantalla de Ajustes
// Fuente visual: docs/design.md §7.2
// Pestañas tipo pill: DURACIÓN / NOTIFICACIONES
// Filas sin divisores con valores en mayúscula/unidad y chevron
// ============================================================

import { useState } from "react";
import type { TimerConfig } from "../../logic/config";
import { Switch } from "./Switch";

export type SettingsKey = keyof TimerConfig;

interface SettingsScreenProps {
  config: TimerConfig;
  onEditField: (key: SettingsKey) => void;
  onClose: () => void;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  autoStartNext: boolean;
  onToggleNotifications: (val: boolean) => void;
  onToggleSound: (val: boolean) => void;
  onToggleAutoStart: (val: boolean) => void;
}

export function SettingsScreen({
  config,
  onEditField,
  onClose,
  notificationsEnabled,
  soundEnabled,
  autoStartNext,
  onToggleNotifications,
  onToggleSound,
  onToggleAutoStart,
}: SettingsScreenProps) {
  const [activeTab, setActiveTab] = useState<"duration" | "notifications">("duration");

  const durationRows: { key: SettingsKey; label: string; value: number; unit: string }[] = [
    { key: "focusDuration", label: "Sesión de foco", value: config.focusDuration, unit: "min" },
    { key: "shortBreakDuration", label: "Descanso corto", value: config.shortBreakDuration, unit: "min" },
    { key: "longBreakDuration", label: "Descanso largo", value: config.longBreakDuration, unit: "min" },
    { key: "longBreakAfter", label: "Descanso largo tras", value: config.longBreakAfter, unit: "Ses." },
  ];

  return (
    <div
      className="screen-enter"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        userSelect: "none",
      }}
    >
      {/* ── Encabezado: Título centrado y botón X a la derecha ── */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 40,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: "var(--text)",
            fontFamily: "var(--font)",
          }}
        >
          Ajustes
        </span>

        {/* Botón X — círculo 40px en top: 24px, right: 20px */}
        <button
          onClick={onClose}
          aria-label="Cerrar ajustes"
          style={{
            position: "absolute",
            right: 20,
            width: 40,
            height: 40,
            borderRadius: 9999,
            backgroundColor: "var(--surface-2)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            outline: "none",
            transition: "background 120ms ease, transform 90ms ease",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* ── Pestañas pill — top: 76px, ancho: 228px ── */}
      <div
        style={{
          position: "absolute",
          top: 76,
          left: "50%",
          transform: "translateX(-50%)",
          width: 232,
          height: 36,
          borderRadius: 9999,
          backgroundColor: "var(--surface-1)",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          padding: 2,
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={() => setActiveTab("duration")}
          style={{
            flex: 1,
            borderRadius: 9999,
            border: activeTab === "duration" ? "1px solid var(--border)" : "none",
            backgroundColor: activeTab === "duration" ? "var(--surface-2)" : "transparent",
            color: activeTab === "duration" ? "var(--text)" : "var(--text-muted)",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.12em",
            cursor: "pointer",
            transition: "all 180ms ease",
            outline: "none",
            fontFamily: "var(--font)",
          }}
        >
          DURACIÓN
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          style={{
            flex: 1,
            borderRadius: 9999,
            border: activeTab === "notifications" ? "1px solid var(--border)" : "none",
            backgroundColor: activeTab === "notifications" ? "var(--surface-2)" : "transparent",
            color: activeTab === "notifications" ? "var(--text)" : "var(--text-muted)",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.12em",
            cursor: "pointer",
            transition: "all 180ms ease",
            outline: "none",
            fontFamily: "var(--font)",
          }}
        >
          ALERTAS
        </button>
      </div>

      {/* ── Contenido de las filas — desde top: 124px ── */}
      <div
        style={{
          position: "absolute",
          top: 124,
          left: 18,
          right: 18,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {activeTab === "duration" ? (
          durationRows.map((row) => (
            <div
              key={row.key}
              onClick={() => onEditField(row.key)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 40,
                padding: "0 12px",
                borderRadius: 12,
                cursor: "pointer",
                transition: "background 100ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {/* Etiqueta izquierda */}
              <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 400, fontFamily: "var(--font)" }}>
                {row.label}
              </span>

              {/* Valor derecho con unidad y chevron */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="num" style={{ fontSize: 17, fontWeight: 600, color: "var(--text)" }}>
                  {String(row.value).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {row.unit}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>
          ))
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 4 }}>
            {/* Fila Sonido */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 42, padding: "0 12px" }}>
              <span style={{ fontSize: 13, color: "var(--text)" }}>Sonido al finalizar</span>
              <Switch checked={soundEnabled} onChange={onToggleSound} ariaLabel="Sonido al finalizar fase" />
            </div>

            {/* Fila Notificaciones */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 42, padding: "0 12px" }}>
              <span style={{ fontSize: 13, color: "var(--text)" }}>Notificaciones de escritorio</span>
              <Switch checked={notificationsEnabled} onChange={onToggleNotifications} ariaLabel="Notificaciones de escritorio" />
            </div>

            {/* Fila Auto-start */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 42, padding: "0 12px" }}>
              <span style={{ fontSize: 13, color: "var(--text)" }}>Iniciar siguiente fase auto.</span>
              <Switch checked={autoStartNext} onChange={onToggleAutoStart} ariaLabel="Iniciar fase siguiente automáticamente" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
