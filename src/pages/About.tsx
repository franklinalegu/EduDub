import { PageShell } from '../components/ui';
import { GetPlaylistVault } from '../components/GetPlaylistVault';

export function About(): JSX.Element {
  return (
    <PageShell title="About EduDub" subtitle="Tutorial videos to English — voice dub + subtitles.">
      <div className="glass space-y-3 p-5 text-[13px] leading-relaxed text-slate-300">
        <p>
          <strong className="text-white">EduDub</strong> by <strong className="text-white">Franklin Alegu (FA)</strong> converts tutorial videos in
          another language to English: local speech-to-text, translation, English voice dub, and subtitles. Screen-text translation
          arrives as an opt-in flag so code, commands and paths are never mistranslated.
        </p>
        <p>
          <strong className="text-white">How handoff works:</strong> EduDub converts first, then saves the finished{' '}
          <code className="rounded bg-white/10 px-1">_en.mp4 + .srt</code> into PlaylistVault&apos;s folder and opens{' '}
          <code className="rounded bg-white/10 px-1">playlistvault://?url=…&edub=…</code> so your library stays in one place.
          Turn it off anytime in Settings.
        </p>
        <p className="rounded-xl border border-amber-500/20 bg-amber-500/[0.07] p-3 text-amber-200/80">
          Education purposes only. Only archive content you own, content licensed for reuse, or content you have explicit
          permission to save. See docs/EDUCATION-NOTICE.md and docs/PRIVACY-GDPR.md.
        </p>
      </div>
      <div className="mt-4">
        <GetPlaylistVault />
      </div>
    </PageShell>
  );
}
