import type { EduStage } from '@shared/types';
import { ProgressBar } from './ui';

const ORDER: EduStage[] = ['analyzing', 'downloading', 'transcribing', 'translating', 'voicing', 'muxing', 'ready'];

export function DubStages({ stage, progress, message }: { stage: EduStage; progress: number; message: string }): JSX.Element {
  const idx = ORDER.indexOf(stage);
  return (
    <div className="glass p-5">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {ORDER.map((s, i) => (
          <span key={s} className={`chip ${i < idx ? 'border-accent-500/30 bg-accent-500/10 text-accent-200' : i === idx ? 'border-edu-lime/30 bg-edu-lime/10 text-edu-lime' : 'opacity-60'}`}>
            {s}
          </span>
        ))}
      </div>
      <ProgressBar value={progress} />
      <p className="mt-2 text-xs text-slate-400">{message}</p>
    </div>
  );
}
