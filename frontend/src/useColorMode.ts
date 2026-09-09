import { useMemo, useState } from "react";
import { useMediaQuery, type PaletteMode } from "@mui/material";

const STORAGE_KEY = "colorMode";

function readStoredOverride(): PaletteMode | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function writeStoredOverride(mode: PaletteMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Ignore — e.g. private browsing. Worst case the choice isn't remembered.
  }
}

/**
 * Follows the browser's prefers-color-scheme by default. Once the user
 * flips the switch, that choice is remembered (localStorage) and takes
 * over — it stops following the system setting until cleared.
 */
export function useColorMode() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [override, setOverride] = useState<PaletteMode | null>(readStoredOverride);

  const mode: PaletteMode = override ?? (prefersDark ? "dark" : "light");

  const toggleMode = useMemo(
    () => () => {
      const next: PaletteMode = mode === "dark" ? "light" : "dark";
      setOverride(next);
      writeStoredOverride(next);
    },
    [mode],
  );

  return { mode, toggleMode };
}
