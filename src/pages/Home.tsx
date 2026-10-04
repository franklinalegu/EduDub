import { useEffect, useState } from 'react';
import { FiLink, FiSearch, FiFile } from 'react-icons/fi';
import type { EduStage } from '@shared/types';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../contexts/ToastContext';
import { PageShell } from '../components/ui';
import { DubStages } from '../components/DubStages';
import { GetPlaylistVault } from '../components/GetPlaylistVault';
import { isWebBuild } from '../web/detect';

export function Home(): JSX.Element {
  const { settings } = useSettings();
  const { success, error } = useToast();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('lesson');
  const [stage, setStage] = useState<EduStage>('queued');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Paste a link or pick a local file to begin.');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (!window.edub) return;
    const off = window.edub.jobs.onStage((s) => {
      const p = s as { stage: EduStage; progress: number; message: string };
      setStage(p.stage);
      setProgress(p.progress);
      setMessage(p.message);
    });
    return off;
  }, []);

  const runLocalFile = async (): Promise<void> => {
    if (!window.edub) {
      error('Desktop bridge missing', 'Run the desktop app or use the web build to convert.');
      return;
    }
    const picked = await window.edub.system.chooseFile();
    if (!picked.ok || !picked.data) return;
    setBusy(true);
    setResult(null);
    setStage('analyzing');
    setProgress(2);
    setMessage('Analyzing file…');
    const res = await window.edub.jobs.runLocalFile(picked.data, title || 'lesson');
    setBusy(false);
    if (!res.ok) {
      setStage('failed');
      error('Conversion failed', res.error);
      return;
    }
    const data = res.data as { videoPath: string; handedOff: boolean };
    setStage('completed');
    setProgress(100);
    setResult(data.videoPath);
    success(data.handedOff ? 'Dubbed + sent to PlaylistVault' : 'English version ready', data.videoPath);
  };

  return (
    <PageShell title="Convert to English" subtitle="E1 · Paste a tutorial link or convert a local file. Voice dub + English subtitles, 100% local.">
      {isWebBuild() && <GetPlaylistVault />}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setMessage(url ? `Link queued: ${url} — desktop app converts it after download.` : 'Paste a link or pick a local file to begin.');
          setStage('analyzing');
        }}
        className="group relative mb-6 flex items-center gap-2 rounded-[18px] border border-white/[0.10] bg-white/[0.06] p-2 shadow-glass backdrop-blur-2xl transition-all focus-within:border-accent-400/50"
      >
        <span className="relative ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-600 to-edu-lime shadow-glow">
          <FiLink className="h-4 w-4 text-white" />
        </span>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=… or Udemy course link" aria-label="Tutorial URL" spellCheck={false} className="relative min-w-0 flex-1 bg-transparent px-2 py-2.5 text-[14px] font-medium text-slate-100 placeholder:text-slate-500 focus:outline-none" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" aria-label="Title" className="hidden w-40 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs sm:block" />
        <button type="submit" disabled={!url.trim()} className="btn-primary relative shrink-0 px-5">
          <FiSearch className="h-4 w-4" /> Analyze
        </button>
      </form>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className={`chip ${settings.autoSendToPlaylistVault ? 'border-accent-500/30 bg-accent-500/10 text-accent-200' : ''}`}>
          Auto-send to PlaylistVault: {settings.autoSendToPlaylistVault ? 'ON' : 'OFF'}
        </span>
        <span className="chip">Target: English</span>
        <button type="button" onClick={() => void runLocalFile()} disabled={busy} className="btn-ghost px-4 py-2 text-xs">
          <FiFile /> {busy ? 'Converting…' : 'Pick local file + convert'}
        </button>
      </div>

      <DubStages stage={stage} progress={progress} message={message} />

      {result && (
        <div className="glass mt-4 p-4 text-xs">
          <p className="font-semibold text-white">Output</p>
          <p className="mt-1 break-all text-slate-400">{result}</p>
        </div>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
        Education use only — only convert content you own, content licensed for reuse, or content you have explicit permission to use.
      </p>
    </PageShell>
  );
}
