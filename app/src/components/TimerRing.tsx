// ============================================================
// Kairo — Anillo de progreso
// Requisitos: R-027, R-028
// Fuente visual: docs/design.md §7.1, §11.2
//
// Arquitectura de animación:
//  - React actualiza estado cada 250ms (sin carga)
//  - El loop rAF corre a 60fps: interpola el progreso real
//    y actualiza TANTO el canvas como los atributos SVG del
//    puntero directamente (sin pasar por React → sin saltos).
//  - Al iniciar/reanudar: sweep de ignición de 600ms (ease-out)
//  - El puntero dispara un pulse CSS al arrancar (pointer-ignite)
// ============================================================

import { useEffect, useRef, useState } from "react";

interface TimerRingProps {
  progress:    number;        // 0 → 1 (snapshot React, 250ms)
  status:      "idle" | "running" | "paused" | "completed";
  startedAt:   number | null; // Date.now() del último tick React
  totalMs:     number;        // duración total de la fase
  remainingMs: number;        // tiempo restante en el snapshot
  size?:       number;          // tamaño del SVG (default 214)
}

const SIZE   = 214;
const STROKE = 10;
const TRACK  = 6;
const R      = (SIZE - STROKE) / 2;

const IGNITE_DURATION = 600; // ms del sweep de ignición

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ── Dibuja el arco en el canvas ───────────────────────────────

function drawArc(canvas: HTMLCanvasElement, p: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr  = window.devicePixelRatio || 1;
  const size = SIZE * dpr;

  if (canvas.width !== size || canvas.height !== size) {
    canvas.width  = size;
    canvas.height = size;
  }

  ctx.clearRect(0, 0, size, size);

  if (p <= 0.0005) return;

  const center     = size / 2;
  const radius     = (size - STROKE * dpr) / 2;
  const startAngle = -Math.PI / 2;
  const endAngle   = startAngle + p * 2 * Math.PI;

  const conic = ctx.createConicGradient(startAngle, center, center);
  const safeP = Math.max(p, 0.001);

  conic.addColorStop(0,                            "rgba(54, 54, 56, 0)");
  conic.addColorStop(safeP * 0.15,                 "rgba(180, 30, 15, 0.45)");
  conic.addColorStop(safeP * 0.40,                 "#D92E14");
  conic.addColorStop(safeP * 0.70,                 "#FF4B2B");
  conic.addColorStop(safeP * 0.92,                 "#FF8A33");
  conic.addColorStop(Math.min(safeP, 0.999),       "#FFC44D");
  if (safeP < 0.999) {
    conic.addColorStop(Math.min(safeP + 0.001, 1), "rgba(0,0,0,0)");
    conic.addColorStop(1,                          "rgba(0,0,0,0)");
  }

  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, radius, startAngle, endAngle, false);
  ctx.strokeStyle = conic;
  ctx.lineWidth   = STROKE * dpr;
  ctx.lineCap     = "round";
  ctx.shadowColor = "rgba(255, 75, 43, 0.45)";
  ctx.shadowBlur  = 10 * dpr;
  ctx.stroke();
  ctx.restore();
}

// ── Mueve los círculos SVG del puntero directamente en el DOM ─

function movePointer(
  haloEl:  SVGCircleElement | null,
  midEl:   SVGCircleElement | null,
  coreEl:  SVGCircleElement | null,
  p: number,
) {
  if (!haloEl && !midEl && !coreEl) return;
  const angle = p * 2 * Math.PI - Math.PI / 2;
  const hx    = String(SIZE / 2 + R * Math.cos(angle));
  const hy    = String(SIZE / 2 + R * Math.sin(angle));
  haloEl?.setAttribute("cx", hx); haloEl?.setAttribute("cy", hy);
  midEl ?.setAttribute("cx", hx); midEl ?.setAttribute("cy", hy);
  coreEl?.setAttribute("cx", hx); coreEl?.setAttribute("cy", hy);
}

// ── Componente ────────────────────────────────────────────────

export function TimerRing({
  progress, status, startedAt, totalMs, remainingMs, size = SIZE,
}: TimerRingProps) {
  const canvasRef  = useRef<HTMLCanvasElement | null>(null);
  const rafRef     = useRef<number | null>(null);

  // Refs para elementos SVG del puntero (actualización directa en DOM)
  const ptrHaloRef = useRef<SVGCircleElement | null>(null);
  const ptrMidRef  = useRef<SVGCircleElement | null>(null);
  const ptrCoreRef = useRef<SVGCircleElement | null>(null);

  // Refs de estado para el rAF (sin re-suscribir el loop)
  const statusRef      = useRef(status);
  const progressRef    = useRef(progress);
  const startedAtRef   = useRef(startedAt);
  const totalMsRef     = useRef(totalMs);
  const remainingMsRef = useRef(remainingMs);

  // Ref para el sweep de ignición
  const igniteStartRef = useRef<number | null>(null);
  const prevStatusRef  = useRef(status);

  // Sincronizar refs con cada prop de React (250ms)
  useEffect(() => { statusRef.current      = status;      }, [status]);
  useEffect(() => { progressRef.current    = progress;    }, [progress]);
  useEffect(() => { startedAtRef.current   = startedAt;   }, [startedAt]);
  useEffect(() => { totalMsRef.current     = totalMs;     }, [totalMs]);
  useEffect(() => { remainingMsRef.current = remainingMs; }, [remainingMs]);

  // Detectar arranque → disparar sweep de ignición
  useEffect(() => {
    if (status === "running" && prevStatusRef.current !== "running") {
      igniteStartRef.current = Date.now();
    }
    prevStatusRef.current = status;
  }, [status]);

  // ── Loop rAF único: canvas + puntero a 60fps ───────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const now = Date.now();
      let liveP: number;

      // Interpolar progreso real entre snapshots de React
      if (
        statusRef.current === "running" &&
        startedAtRef.current !== null &&
        totalMsRef.current > 0
      ) {
        const elapsed    = now - startedAtRef.current;
        const liveRemain = Math.max(remainingMsRef.current - elapsed, 0);
        liveP = 1 - liveRemain / totalMsRef.current;
      } else {
        liveP = progressRef.current;
      }

      // Aplicar sweep de ignición
      if (igniteStartRef.current !== null) {
        const elapsed = now - igniteStartRef.current;
        if (elapsed < IGNITE_DURATION) {
          liveP = liveP * easeOutCubic(elapsed / IGNITE_DURATION);
        } else {
          igniteStartRef.current = null;
        }
      }

      const clampedP = Math.min(Math.max(liveP, 0), 1);
      const visible  = clampedP > 0.0005;

      // Actualizar canvas
      drawArc(canvas, clampedP);

      // Actualizar posición del puntero directamente en el DOM (60fps, sin React)
      if (visible) {
        movePointer(ptrHaloRef.current, ptrMidRef.current, ptrCoreRef.current, clampedP);
        ptrHaloRef.current?.parentElement?.removeAttribute("data-hidden");
      } else {
        ptrHaloRef.current?.parentElement?.setAttribute("data-hidden", "true");
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []); // Sin dependencias — lee todo de refs

  // ── Pulse CSS del puntero al arrancar ─────────────────────
  const [igniteKey, setIgniteKey] = useState(0);
  const prevStatusForKey = useRef(status);

  useEffect(() => {
    if (status === "running" && prevStatusForKey.current !== "running") {
      setIgniteKey(k => k + 1);
    }
    prevStatusForKey.current = status;
  }, [status]);

  // ── Valores estáticos de React (solo para visibilidad inicial) ──
  const isPaused  = status === "paused";
  const p         = Math.min(Math.max(progress, 0), 1);
  const hasArc    = p > 0.0005;

  // Posición inicial del puntero (el rAF la actualizará en el primer frame)
  const angle0 = p * 2 * Math.PI - Math.PI / 2;
  const headX0 = SIZE / 2 + R * Math.cos(angle0);
  const headY0 = SIZE / 2 + R * Math.sin(angle0);

  const scale = size / SIZE;

  return (
    <div style={{ position: "relative", width: size, height: size, overflow: "visible" }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: SIZE,
        height: SIZE,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}>

      {/* Resplandor ambiental difuso */}
      {hasArc && (
        <div style={{
          position:      "absolute",
          width:         150,
          height:        150,
          left:          "50%",
          top:           "50%",
          transform:     "translate(-50%, -50%)",
          borderRadius:  "50%",
          background:    "radial-gradient(circle, rgba(255,75,43,0.10) 0%, rgba(229,48,26,0.03) 50%, transparent 75%)",
          filter:        "blur(20px)",
          pointerEvents: "none",
          opacity:       isPaused ? 0.35 : 1,
          transition:    "opacity 300ms ease",
        }} />
      )}

      {/* SVG base: defs, ondas y pista */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="pointer-outer-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFAA33" stopOpacity="0.85" />
            <stop offset="40%"  stopColor="#FF6A1A" stopOpacity="0.45" />
            <stop offset="75%"  stopColor="#E5301A" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#E5301A" stopOpacity="0"    />
          </radialGradient>
          <radialGradient id="pointer-core" cx="45%" cy="45%" r="50%">
            <stop offset="0%"   stopColor="#FFFFFF" />
            <stop offset="35%"  stopColor="#FFF2A3" />
            <stop offset="75%"  stopColor="#FFB338" />
            <stop offset="100%" stopColor="#FF7A1A" />
          </radialGradient>
          <filter id="glow-head-flare" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6.5" result="flare-wide" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="2"   result="flare-mid"  />
            <feMerge>
              <feMergeNode in="flare-wide" />
              <feMergeNode in="flare-mid"  />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Guía exterior única para conservar profundidad sin ruido visual. */}
        <circle cx={SIZE/2} cy={SIZE/2} r={R + 28} fill="none" stroke="var(--track-faint)" strokeWidth={1} opacity={0.18} />

        {/* Pista gris */}
        <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke="var(--track)" strokeWidth={TRACK} />
      </svg>

      {/* Canvas del arco — dibujado a 60fps por rAF */}
      <canvas
        ref={canvasRef}
        style={{
          position:      "absolute",
          top:           0,
          left:          0,
          width:         SIZE,
          height:        SIZE,
          pointerEvents: "none",
          opacity:       isPaused ? 0.6 : 1,
          transition:    "opacity 300ms ease",
        }}
      />

      {/* Puntero SVG — posición actualizada directamente por rAF (60fps, sin saltos) */}
      <svg
        key={igniteKey}
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{
          position:      "absolute",
          top:           0,
          left:          0,
          pointerEvents: "none",
          overflow:      "visible",
          display:       hasArc ? undefined : "none",
        }}
      >
        {/* Halo exterior con pulse de ignición */}
        <circle
          ref={ptrHaloRef}
          cx={headX0} cy={headY0} r={13}
          fill="url(#pointer-outer-halo)"
          className={status === "running" ? "pointer--ignite" : ""}
          style={{
            opacity:         isPaused ? 0.4 : 0.9,
            transition:      "opacity 300ms ease",
            transformOrigin: `${headX0}px ${headY0}px`,
          }}
        />
        {/* Destello medio */}
        <circle
          ref={ptrMidRef}
          cx={headX0} cy={headY0} r={5.5}
          fill="#FFAA38"
          filter="url(#glow-head-flare)"
          style={{ opacity: isPaused ? 0.5 : 0.85, transition: "opacity 300ms ease" }}
        />
        {/* Núcleo incandescente */}
        <circle
          ref={ptrCoreRef}
          cx={headX0} cy={headY0} r={3.8}
          fill="url(#pointer-core)"
          style={{ opacity: isPaused ? 0.7 : 1, transition: "opacity 300ms ease" }}
        />
      </svg>
      </div>
    </div>
  );
}


