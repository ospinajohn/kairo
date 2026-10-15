// ============================================================
// Kairo — Región accesible para el tiempo restante
// Fuente visual: docs/design.md §12
// Anuncia cada 60 s y en el cambio de fase, sin anunciar
// cada segundo. El tiempo visible mantiene role="timer".
// ============================================================

import { useEffect, useState } from 'react';
import type { Phase } from '../logic/config';
import type { TimerStatus } from '../logic/timer';

interface TimeAnnouncerProps {
  phase: Phase;
  minutes: number;
  status: TimerStatus;
}

const PHASE_NAMES: Record<Phase, string> = {
  focus: 'Concentración',
  'short-break': 'Descanso corto',
  'long-break': 'Descanso largo',
};

export function TimeAnnouncer({ phase, minutes, status }: TimeAnnouncerProps) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status !== 'running' && status !== 'paused') return;
    const restante = minutes === 1 ? 'Queda 1 minuto' : `Quedan ${minutes} minutos`;
    setMessage(`${PHASE_NAMES[phase]}. ${restante}.`);
  }, [phase, minutes, status]);

  return (
    <div className='sr-only' role='status' aria-live='polite' aria-atomic='true'>
      {message}
    </div>
  );
}
