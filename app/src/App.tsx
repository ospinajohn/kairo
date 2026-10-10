// ============================================================
// Kairo — Pantalla principal
// Medidas exactas de docs/design.md §7.1 (base 320x320px)
//
// Centro del anillo:     top 42% = 134px
// Ícono de fase:         top 27% = 86px  (absoluto sobre ventana)
// Tiempo:                top 40% = 128px (absoluto)
// Indicador sesiones:    top 52% = 166px (absoluto)
// Etiqueta de fase:      top 59% = 189px (absoluto)
// Fila de botones:       top 86% = 275px (absoluto)
// ============================================================

import { useState }             from "react";
import { useTimer }              from "./hooks/useTimer";
import { TimerRing }             from "./components/TimerRing";
import { PhaseIcon, PhaseLabel } from "./components/PhaseLabel";
import { SessionDots }           from "./components/SessionDots";
import { MainControls }          from "./components/MainControls";
import { WindowControls }        from "./components/WindowControls";
import { SettingsScreen }        from "./components/Settings/SettingsScreen";
import type { SettingsKey }      from "./components/Settings/SettingsScreen";
import { ValueEditor }           from "./components/Settings/ValueEditor";
import { DEFAULT_CONFIG, CONFIG_RANGES, clampConfigValue } from "./logic/config";
import type { TimerConfig }      from "./logic/config";

type Screen = "timer" | "settings" | "editor";

export default function App() {
  const [config, setConfig] = useState<TimerConfig>(DEFAULT_CONFIG);
  const [currentScreen, setCurrentScreen] = useState<Screen>("timer");
  const [editingKey, setEditingKey] = useState<SettingsKey>("focusDuration");

  // Preferencias de alertas / notificaciones
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoStartNext, setAutoStartNext] = useState(false);

  const { state, progress, minutes, seconds, startedAt,
          onStart, onPause, onResume, onReset } = useTimer(config);

  const { currentPhase, completedSessions } = state.cycle;
  const isPaused  = state.status === "paused";
  const isRunning = state.status === "running";

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  const handleEditField = (key: SettingsKey) => {
    setEditingKey(key);
    setCurrentScreen("editor");
  };

  const handleValueChange = (newVal: number) => {
    setConfig(prev => ({
      ...prev,
      [editingKey]: clampConfigValue(editingKey, newVal),
    }));
  };

  const editorMeta: Record<SettingsKey, { title: string; unit: string }> = {
    focusDuration:      { title: "Sesión de foco", unit: "min" },
    shortBreakDuration: { title: "Descanso corto", unit: "min" },
    longBreakDuration:  { title: "Descanso largo", unit: "min" },
    longBreakAfter:     { title: "Descanso tras", unit: "Sesiones" },
  };

  return (
    <div
      className="kairo-widget"
      data-tauri-drag-region
      style={{
        position:        "relative",
        width:           320,
        height:          320,
        borderRadius:    54,
        backgroundColor: "var(--bg)",
        backgroundImage: "radial-gradient(90% 90% at 50% 100%, rgba(120,25,10,0.18) 0%, rgba(0,0,0,0) 70%)",
        border:          "1px solid var(--border-subtle)",
        overflow:        "hidden",
        userSelect:      "none",
        cursor:          "default",
      }}
    >
      {/* Controles de ventana: tenues en reposo, visibles al hover */}
      <WindowControls />

      {/* ═══════════════ PANTALLA 1: TEMPORIZADOR ═══════════════ */}
      {currentScreen === "timer" && (
          <div className="screen-enter" style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* Anillo — centro en top:134px, diámetro 214px */}
            <div style={{
              position:  "absolute",
              top:       134,
              left:      "50%",
              transform: "translate(-50%, -50%)",
              width:     214,
              height:    214,
            }}>
              <TimerRing
                progress={progress}
                status={state.status}
                startedAt={startedAt}
                totalMs={state.totalMs}
                remainingMs={state.remainingMs}
              />
            </div>

            {/* Ícono de fase — top: 86px */}
            <div style={{
              position:       "absolute",
              top:            86,
              left:           0, right: 0,
              display:        "flex",
              justifyContent: "center",
              color:          "var(--text-muted)",
              pointerEvents:  "none",
            }}>
              <PhaseIcon phase={currentPhase} />
            </div>

            {/* Tiempo — top: 117px */}
            <div style={{
              position:       "absolute",
              top:            117,
              left:           0, right: 0,
              display:        "flex",
              justifyContent: "center",
              pointerEvents:  "none",
            }}>
              <span
                className="num"
                style={{
                  fontSize:      48,
                  fontWeight:    400,
                  letterSpacing: "-0.01em",
                  color:         "var(--text)",
                  fontFamily:    "var(--font)",
                  lineHeight:    1,
                  animation:     isPaused ? "blink-pause 2s ease-in-out infinite" : undefined,
                }}
                role="timer"
                aria-label={`${mm} minutos ${ss} segundos restantes`}
                aria-live="off"
              >
                {mm}:{ss}
              </span>
            </div>

            {/* Indicador de sesiones — top: 166px */}
            <div style={{
              position:       "absolute",
              top:            166,
              left:           0, right: 0,
              display:        "flex",
              justifyContent: "center",
              pointerEvents:  "none",
            }}>
              <SessionDots
                total={config.longBreakAfter}
                completed={completedSessions}
                running={isRunning && currentPhase === "focus"}
              />
            </div>

            {/* Etiqueta de fase — top: 189px */}
            <div style={{
              position:       "absolute",
              top:            189,
              left:           0, right: 0,
              display:        "flex",
              justifyContent: "center",
              pointerEvents:  "none",
            }}>
              <PhaseLabel phase={currentPhase} />
            </div>

            {/* Botones inferiores — top: 263px */}
            <div style={{
              position:       "absolute",
              top:            263,
              left:           0, right: 0,
              display:        "flex",
              justifyContent: "center",
            }}>
              <MainControls
                status={state.status}
                onStart={onStart}
                onPause={onPause}
                onResume={onResume}
                onReset={onReset}
                onSettings={() => setCurrentScreen("settings")}
              />
            </div>
          </div>
        )}

        {/* ═══════════════ PANTALLA 2: AJUSTES ═══════════════ */}
        {currentScreen === "settings" && (
          <SettingsScreen
            config={config}
            onEditField={handleEditField}
            onClose={() => setCurrentScreen("timer")}
            notificationsEnabled={notificationsEnabled}
            soundEnabled={soundEnabled}
            autoStartNext={autoStartNext}
            onToggleNotifications={setNotificationsEnabled}
            onToggleSound={setSoundEnabled}
            onToggleAutoStart={setAutoStartNext}
          />
        )}

        {/* ═══════════════ PANTALLA 3: EDITOR NUMÉRICO ═══════════════ */}
        {currentScreen === "editor" && (
          <ValueEditor
            title={editorMeta[editingKey].title}
            value={config[editingKey]}
            unit={editorMeta[editingKey].unit}
            min={CONFIG_RANGES[editingKey].min}
            max={CONFIG_RANGES[editingKey].max}
            step={CONFIG_RANGES[editingKey].step}
            onChange={handleValueChange}
            onBack={() => setCurrentScreen("settings")}
          />
        )}
      </div>
  );
}
