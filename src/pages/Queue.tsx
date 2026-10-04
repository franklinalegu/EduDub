import { PageShell } from '../components/ui';

export function Queue(): JSX.Element {
  return (
    <PageShell title="Queue" subtitle="Batch tutorial conversions. V1 processes one job at a time, locally.">
      <div className="glass p-8 text-center text-sm text-slate-400">
        Queue lands in v0.2 with batch playlists. Convert single files from <span className="text-slate-200">Convert</span> for now.
      </div>
    </PageShell>
  );
}
