import { Link } from 'react-router-dom';
import { FiDownload, FiMonitor } from 'react-icons/fi';

/** Web upsell: recommend PlaylistVault for YouTube/playlist content. */
export function GetPlaylistVault({ compact = false }: { compact?: boolean }): JSX.Element {
  const href = 'https://github.com/franklinalegu/playlistvault/releases';
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <a href={href} target="_blank" rel="noreferrer" className="btn-primary px-4 py-1.5 text-xs">
          <FiDownload className="h-3.5 w-3.5" /> Get PlaylistVault
        </a>
        <span className="text-xs text-slate-500">for full YouTube playlists & channels</span>
      </div>
    );
  }
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-white/[0.08] bg-gradient-to-r from-accent-500/[0.10] via-edu-lime/[0.06] to-edu-teal/[0.08] p-5 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-edu-lime shadow-glow">
          <FiMonitor className="h-5 w-5 text-white" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold tracking-tight text-white">YouTube video or full playlist? Save it with PlaylistVault</p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-400">Parallel downloads, 4K, offline library — EduDub hands finished English dubs straight to it.</p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <a href={href} target="_blank" rel="noreferrer" className="btn-primary px-5">
          <FiDownload className="h-4 w-4" /> Get PlaylistVault
        </a>
        <Link to="/about" className="btn-ghost">How handoff works</Link>
      </div>
    </div>
  );
}
