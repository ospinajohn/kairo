// ============================================================
// Kairo — Pruebas de la lógica del temporizador
// Tarea: T-022 | Requisito: NF-012
// ============================================================

import { describe, it, expect } from "vitest";
import { DEFAULT_CONFIG, clampConfigValue, phaseDurationMs } from "../logic/config";
import { nextCycleState, INITIAL_CYCLE } from "../logic/cycle";
import {
  createInitialState,
  startTimer,
  pauseTimer,
  tickTimer,
  skipPhaseTimer,
  resetPhase,
  advancePhase,
  progress,
  msToTime,
} from "../logic/timer";

// ── config.ts ─────────────────────────────────────────────────────────────────

describe("clampConfigValue", () => {
  it("respeta el mínimo", () => {
    expect(clampConfigValue("focusDuration", 0)).toBe(1);
  });
  it("respeta el máximo", () => {
    expect(clampConfigValue("focusDuration", 999)).toBe(120);
  });
  it("devuelve el valor si está dentro del rango", () => {
    expect(clampConfigValue("shortBreakDuration", 10)).toBe(10);
  });
});

describe("phaseDurationMs", () => {
  it("convierte minutos a ms correctamente", () => {
    expect(phaseDurationMs("focus", DEFAULT_CONFIG)).toBe(25 * 60_000);
    expect(phaseDurationMs("short-break", DEFAULT_CONFIG)).toBe(5 * 60_000);
    expect(phaseDurationMs("long-break", DEFAULT_CONFIG)).toBe(15 * 60_000);
  });
});

// ── cycle.ts ──────────────────────────────────────────────────────────────────

describe("nextCycleState", () => {
  it("focus → short-break si no se alcanzó el umbral", () => {
    const next = nextCycleState(INITIAL_CYCLE, DEFAULT_CONFIG);
    expect(next.currentPhase).toBe("short-break");
    expect(next.completedSessions).toBe(1);
  });

  it("focus → long-break al alcanzar el umbral (4 sesiones)", () => {
    const state = { currentPhase: "focus" as const, completedSessions: 3 };
    const next  = nextCycleState(state, DEFAULT_CONFIG);
    expect(next.currentPhase).toBe("long-break");
    expect(next.completedSessions).toBe(4);
  });

  it("short-break → focus sin cambiar sesiones", () => {
    const state = { currentPhase: "short-break" as const, completedSessions: 1 };
    const next  = nextCycleState(state, DEFAULT_CONFIG);
    expect(next.currentPhase).toBe("focus");
    expect(next.completedSessions).toBe(1);
  });

  it("long-break → focus y reinicia contador", () => {
    const state = { currentPhase: "long-break" as const, completedSessions: 4 };
    const next  = nextCycleState(state, DEFAULT_CONFIG);
    expect(next.currentPhase).toBe("focus");
    expect(next.completedSessions).toBe(0);
  });
});

// ── timer.ts ──────────────────────────────────────────────────────────────────

describe("createInitialState", () => {
  it("empieza en idle con la duración correcta", () => {
    const s = createInitialState(DEFAULT_CONFIG);
    expect(s.status).toBe("idle");
    expect(s.remainingMs).toBe(25 * 60_000);
    expect(s.cycle.currentPhase).toBe("focus");
  });
});

describe("startTimer / pauseTimer", () => {
  it("idle → running al iniciar", () => {
    const s = startTimer(createInitialState(DEFAULT_CONFIG));
    expect(s.status).toBe("running");
  });

  it("running → paused al pausar", () => {
    const s = pauseTimer(startTimer(createInitialState(DEFAULT_CONFIG)));
    expect(s.status).toBe("paused");
  });

  it("no cambia si ya está corriendo", () => {
    const s = startTimer(createInitialState(DEFAULT_CONFIG));
    expect(startTimer(s).status).toBe("running");
  });
});

describe("tickTimer", () => {
  it("reduce el tiempo restante", () => {
    const s = tickTimer(startTimer(createInitialState(DEFAULT_CONFIG)), 1000);
    expect(s.remainingMs).toBe(25 * 60_000 - 1000);
    expect(s.status).toBe("running");
  });

  it("marca completed al llegar a 0", () => {
    const s0 = startTimer(createInitialState(DEFAULT_CONFIG));
    const s1 = tickTimer(s0, 25 * 60_000);
    expect(s1.remainingMs).toBe(0);
    expect(s1.status).toBe("completed");
  });

  it("no avanza si está pausado", () => {
    const s0 = pauseTimer(startTimer(createInitialState(DEFAULT_CONFIG)));
    const s1 = tickTimer(s0, 5000);
    expect(s1.remainingMs).toBe(s0.remainingMs);
  });

  it("no produce tiempo negativo", () => {
    const s0 = startTimer(createInitialState(DEFAULT_CONFIG));
    const s1 = tickTimer(s0, 99 * 60_000);
    expect(s1.remainingMs).toBeGreaterThanOrEqual(0);
  });
});

describe("skipPhaseTimer", () => {
  it("salta de focus a short-break", () => {
    const s = skipPhaseTimer(createInitialState(DEFAULT_CONFIG), DEFAULT_CONFIG);
    expect(s.cycle.currentPhase).toBe("short-break");
    expect(s.status).toBe("idle");
  });
});

describe("resetPhase", () => {
  it("vuelve al inicio de la fase sin cambiar el ciclo", () => {
    let s = startTimer(createInitialState(DEFAULT_CONFIG));
    s = tickTimer(s, 5000);
    s = resetPhase(s, DEFAULT_CONFIG);
    expect(s.remainingMs).toBe(25 * 60_000);
    expect(s.status).toBe("idle");
    expect(s.cycle.currentPhase).toBe("focus");
  });
});

describe("advancePhase", () => {
  it("avanza al siguiente estado del ciclo tras completar", () => {
    let s = startTimer(createInitialState(DEFAULT_CONFIG));
    s = tickTimer(s, 25 * 60_000); // completar
    s = advancePhase(s, DEFAULT_CONFIG);
    expect(s.cycle.currentPhase).toBe("short-break");
    expect(s.status).toBe("idle");
  });
});

describe("progress", () => {
  it("es 0 al inicio", () => {
    expect(progress(createInitialState(DEFAULT_CONFIG))).toBe(0);
  });

  it("es 1 al completar", () => {
    let s = startTimer(createInitialState(DEFAULT_CONFIG));
    s = tickTimer(s, 25 * 60_000);
    expect(progress(s)).toBe(1);
  });

  it("es 0.5 a la mitad", () => {
    let s = startTimer(createInitialState(DEFAULT_CONFIG));
    s = tickTimer(s, (25 * 60_000) / 2);
    expect(progress(s)).toBeCloseTo(0.5);
  });
});

describe("msToTime", () => {
  it("convierte correctamente", () => {
    expect(msToTime(90_000)).toEqual({ minutes: 1, seconds: 30 });
    expect(msToTime(0)).toEqual({ minutes: 0, seconds: 0 });
    expect(msToTime(60_000)).toEqual({ minutes: 1, seconds: 0 });
  });

  it("redondea hacia arriba los segundos parciales", () => {
    expect(msToTime(1500)).toEqual({ minutes: 0, seconds: 2 });
  });
});
