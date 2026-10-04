import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_SETTINGS, type EduSettings } from '@shared/types';

interface SettingsValue {
  settings: EduSettings;
  update: (patch: Partial<EduSettings>) => void;
}

const Ctx = createContext<SettingsValue | null>(null);
const KEY = 'edudub-settings-v1';

function load(): EduSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<EduSettings>) };
  } catch {
    // defaults
  }
  return DEFAULT_SETTINGS;
}

export function SettingsProvider({ children }: { children: ReactNode }): JSX.Element {
  const [settings, setSettings] = useState<EduSettings>(load);
  const update = useCallback((patch: Partial<EduSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // private mode
      }
      return next;
    });
  }, []);
  const value = useMemo(() => ({ settings, update }), [settings, update]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings(): SettingsValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSettings outside provider');
  return v;
}
