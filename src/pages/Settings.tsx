import { useSettings } from '../contexts/SettingsContext';
import { PageShell, Toggle } from '../components/ui';

export function SettingsPage(): JSX.Element {
  const { settings, update } = useSettings();
  const chooseFolder = async (): Promise<void> => {
    if (!window.edub) return;
    const r = await window.edub.system.chooseFolder(settings.defaultDestination);
    if (r.ok && r.data) update({ defaultDestination: r.data });
  };
  return (
    <PageShell title="Settings" subtitle="Local-first. Nothing uploads anywhere.">
      <div className="glass divide-y divide-white/[0.06] px-5">
        <Toggle checked={settings.autoSendToPlaylistVault} onChange={(v) => update({ autoSendToPlaylistVault: v })} label="Auto-send to PlaylistVault after dubbing" description="When ON, the finished English file is saved into PlaylistVault and it opens automatically. Turn OFF to keep files in EduDub only." />
        <Toggle checked={settings.keepOriginalAudio} onChange={(v) => update({ keepOriginalAudio: v })} label="Keep original audio underneath" description="Mixes the English dub over the original at low volume, preserving tone and emphasis." />
        <Toggle checked={settings.createSrt} onChange={(v) => update({ createSrt: v })} label="Create English subtitles (.srt)" description="Always recommended for tutorials — lets viewers read along with code on screen." />
        <div className="flex items-center justify-between gap-6 py-3">
          <div>
            <p className="text-sm font-medium text-slate-200">Default destination</p>
            <p className="mt-0.5 text-xs text-slate-500">{settings.defaultDestination || 'PlaylistVault folder (auto)'}</p>
          </div>
          <button type="button" onClick={() => void chooseFolder()} className="btn-ghost px-4 py-2 text-xs">Choose</button>
        </div>
      </div>
    </PageShell>
  );
}
