// ============================================================
// Kairo — Hook useCompactMode
// Requisito: R-107 (PRO-07)
// ============================================================

import { useCallback, useState } from "react";
import { getCurrentWindow }      from "@tauri-apps/api/window";
import { PhysicalSize }          from "@tauri-apps/api/dpi";

const NORMAL_SIZE  = new PhysicalSize(352, 352);
const COMPACT_SIZE = new PhysicalSize(220, 220);

export function useCompactMode() {
  const [compact, setCompact] = useState(false);

  const toggleCompact = useCallback(async () => {
    const next = !compact;
    const win  = getCurrentWindow();
    await win.setSize(next ? COMPACT_SIZE : NORMAL_SIZE);
    setCompact(next);
  }, [compact]);

  return { compact, toggleCompact };
}
