// ============================================================
// Kairo — Pantalla principal
// Medidas exactas de docs/design.md §7.1 (base 320x320px)
// ============================================================

import { useState }              from "react";
import { useConfig }             from "./hooks/useConfig";
import { useTimer }              from "./hooks/useTimer";
import { useNotification }       from "./hooks/useNotification";
import { useWindowControls }     from "./hooks/useWindowControls";
import { useCompactMode }        from "./hooks/useCompactMode";
import { useSound }              from "./hooks/useSound";
import { TimerRing }             from "./components/TimerRing";
import { PhaseIcon, PhaseLabel } from "./components/PhaseLabel";
import { SessionDots }           from "./components/SessionDots";
import { MainControls }          from "./components/MainControls";
import { WindowControls }        from "./components/WindowControls";
import { SettingsScreen }        from "./components/Settings/SettingsScreen";
import type { SettingsKey }      from "./components/Settings/SettingsScreen";
import { ValueEditor }           from "./components/Settings/ValueEditor";
import { CONFIG_RANGES }         from "./logic/config";

type Screen = "timer" | "settings" | "editor";

export default function App() {
  const { config, setField } = useConfig();

  const [currentScreen, setCurrentScreen] = useState<Screen>("timer");
  const [editingKey, setEditingKey]        = useState<SettingsKey>("focusDuration");

  // Preferencias de alertas
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled,         setSoundEnabled]         = useState(true);
  const [autoStartNext,        setAutoStartNext]        = useState(false);

  // Hooks de sistema
  const { notify }                                              = useNotification(notificationsEnabled, config.longBreakAfter);
  const { play: playSound }                                     = useSound(soundEnabled);
  const { alwaysOnTop, autostart, minimizeToTray, toggleAlwaysOnTop, toggleAutostart, toggleMinimizeToTray } = useWindowControls();
  const { compact, toggleCompact }                              = useCompactMode();

  // Callback al completar una fase: notificación + sonido
  const onPhaseComplete = (s: Parameters<typeof notify>[0]) => {
    notify(s);
    playSound();
  };

  const { state, progress, minutes, seconds, startedAt,
          onStart, onPause, onResume, onReset } = useTimer(config, onPhaseComplete);

  const { currentPhase, completedSessions } = state.cycle;
  const isPaused  = state.status === "paused";
  const isRunning = state.status === "running";

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  const handleEditField    = (key: SettingsKey) => { setEditingKey(key); setCurrentScreen("editor"); };
  const handleValueChange  = (val: number)       => setField(editingKey, val);

  const editorMeta: Record<SettingsKey, { title: string; unit: string }> = {
    focusDuration:      { title: "Sesión de foco",  unit: "min"      },
    shortBreakDuration: { title: "Descanso corto",  unit: "min"      },
    longBreakDuration:  { title: "Descanso largo",  unit: "min"      },
    longBreakAfter:     { title: "Descanso tras",   unit: "Sesiones" },
  };

  // Tamaño de la ventana según modo compacto
  const winSize   = compact ? 188 : 320;
  const winRadius = compact ? 36  : 54;

  return (
    <div
      data-tauri-drag-region
      style={{
        position:        "relative",
        width:           winSize,
        height:          winSize,
        borderRadius:    winRadius,
        backgroundColor: "var(--bg)",
        backgroundImage: "radial-gradient(90% 90% at 50% 100%, rgba(120,25,10,0.18) 0%, rgba(0,0,0,0) 70%)",
        border:          "1px solid var(--border-subtle)",
        overflow:        "hidden",
        userSelect:      "none",
        cursor:          "default",
        transition:      "width 300ms ease, height 300ms ease, border-radius 300ms ease",
      }}
    >
      <WindowControls />

      {/* ═══ MODO COMPACTO: solo anillo + tiempo ═══ */}
      {compact && (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 140, height: 140,
          }}>
            <TimerRing
              progress={progress}
              status={state.status}
              startedAt={startedAt}
              totalMs={state.totalMs}
              remainingMs={state.remainingMs}
              size={140}
            />
          </div>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
            <span className="num" style={{
              fontSize: 28, fontWeight: 400, letterSpacing: "-0.01em",
              color: "var(--text)", fontFamily: "var(--font)", lineHeight: 1,
            }}>
              {mm}:{ss}
            </span>
          </div>
          {/* Botón para salir del modo compacto */}
          <button
            onClick={toggleCompact}
            aria-label="Salir del modo compacto"
            style={{
              position: "absolute", bottom: 8, right: 8,
              width: 24, height: 24, borderRadius: 9999,
              background: "var(--surface-2)", border: "1px solid var(--border)",
              color: "var(--text-muted)", cursor: "pointer", fontSize: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ⤢
          </button>
        </div>
      )}

      {/* ═══ MODO NORMAL ═══ */}
      {!compact && (
        <>
          {/* PANTALLA 1: TEMPORIZADOR */}
          {currentScreen === "timer" && (
            <div className="screen-enter" style={{ position: "relative", width: "100%", height: "100%" }}>

              <div style={{
                position: "absolute", top: 134, left: "50%",
                transform: "translate(-50%, -50%)", width: 214, height: 214,
              }}>
                <TimerRing
                  progress={progress}
                  status={state.status}
                  startedAt={startedAt}
                  totalMs={state.totalMs}
                  remainingMs={state.remainingMs}
                />
              </div>

              <div style={{
                position: "absolute", top: 86, left: 0, right: 0,
                display: "flex", justifyContent: "center",
                color: "var(--text-muted)", pointerEvents: "none",
              }}>
                <PhaseIcon phase={currentPhase} />
              </div>

              <div style={{
                position: "absolute", top: 117, left: 0, right: 0,
                display: "flex", justifyContent: "center", pointerEvents: "none",
              }}>
                <span
                  className="num"
                  style={{
                    fontSize: 48, fontWeight: 400, letterSpacing: "-0.01em",
                    color: "var(--text)", fontFamily: "var(--font)", lineHeight: 1,
                    animation: isPaused ? "blink-pause 2s ease-in-out infinite" : undefined,
                  }}
                  role="timer"
                  aria-label={`${mm} minutos ${ss} segundos restantes`}
                  aria-live="off"
                >
                  {mm}:{ss}
                </span>
              </div>

              <div style={{
                position: "absolute", top: 166, left: 0, right: 0,
                display: "flex", justifyContent: "center", pointerEvents: "none",
              }}>
                <SessionDots
                  total={config.longBreakAfter}
                  completed={completedSessions}
                  running={isRunning && currentPhase === "focus"}
                />
              </div>

              <div style={{
                position: "absolute", top: 189, left: 0, right: 0,
                display: "flex", justifyContent: "center", pointerEvents: "none",
              }}>
                <PhaseLabel phase={currentPhase} />
              </div>

              <div style={{
                position: "absolute", top: 263, left: 0, right: 0,
                display: "flex", justifyContent: "center",
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

          {/* PANTALLA 2: AJUSTES */}
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
              alwaysOnTop={alwaysOnTop}
              autostart={autostart}
              minimizeToTray={minimizeToTray}
              compact={compact}
              onToggleAlwaysOnTop={toggleAlwaysOnTop}
              onToggleAutostart={toggleAutostart}
              onToggleMinimizeToTray={toggleMinimizeToTray}
              onToggleCompact={toggleCompact}
            />
          )}

          {/* PANTALLA 3: EDITOR NUMÉRICO */}
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
        </>
      )}
    </div>
  );
}


