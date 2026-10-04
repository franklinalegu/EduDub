import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface Toast {
  id: number;
  kind: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}
interface ToastValue {
  toasts: Toast[];
  toast: (t: Omit<Toast, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

const Ctx = createContext<ToastValue | null>(null);
let n = 0;

export function ToastProvider({ children }: { children: ReactNode }): JSX.Element {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++n;
    setToasts((p) => [...p.slice(-3), { ...t, id }]);
    window.setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 4500);
  }, []);
  const value = useMemo<ToastValue>(
    () => ({
      toasts,
      toast,
      success: (title, description) => toast({ kind: 'success', title, description }),
      error: (title, description) => toast({ kind: 'error', title, description })
    }),
    [toasts, toast]
  );
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="glass p-3 text-xs">
            <p className="font-semibold text-white">{t.title}</p>
            {t.description && <p className="mt-0.5 text-slate-400">{t.description}</p>}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useToast outside provider');
  return v;
}
