import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function PageShell({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }): JSX.Element {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }} className="mx-auto w-full max-w-[1080px] px-4 py-5 sm:px-8 sm:py-7">
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center rounded-full border border-accent-500/20 bg-gradient-to-r from-accent-500/20 to-edu-lime/15 px-2.5 py-1 text-[10px] font-black tracking-widest text-accent-200">
              E1 · EDU
            </span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-edu-lime via-accent-400 to-edu-teal shadow-[0_0_10px_rgba(34,197,94,0.9)]" />
            <h1 className="min-w-0 truncate font-display text-[22px] font-extrabold text-white sm:text-[28px]">{title}</h1>
          </div>
          {subtitle && <p className="max-w-2xl pl-1 text-[13.5px] leading-relaxed text-slate-400">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2 pt-1">{actions}</div>}
      </div>
      {children}
    </motion.div>
  );
}

export function ProgressBar({ value, className = '' }: { value: number; className?: string }): JSX.Element {
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)} className={`relative h-1.5 w-full overflow-hidden rounded-full bg-black/30 shadow-inner ${className}`}>
      <div className="h-full w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="relative h-full rounded-full"
          style={{ backgroundImage: 'linear-gradient(90deg, #A3E635, var(--accent), #14B8A6)', boxShadow: '0 0 12px rgba(34, 197, 94, 0.55)' }}
          initial={false}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (n: boolean) => void; label: string; description?: string }): JSX.Element {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-6 py-3">
      <span className="min-w-0">
        <span className="block text-sm font-medium text-slate-200">{label}</span>
        {description && <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-all duration-200 ${checked ? 'bg-gradient-to-r from-accent-600 to-accent-400 shadow-[0_0_12px_rgba(34,197,94,0.45)]' : 'border border-white/10 bg-white/10'}`}
      >
        <motion.span layout transition={{ type: 'spring', stiffness: 520, damping: 32 }} className="absolute top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-white shadow" style={{ left: checked ? 24 : 4 }} />
      </button>
    </label>
  );
}
