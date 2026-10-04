import fs from 'node:fs';
import path from 'node:path';
import { shell } from 'electron';
import { resolveWithin, safeFilename } from '../util/sanitize.js';
import type { VaultHandoff } from '../../shared/types.js';

function playlistVaultDestinations(): string[] {
  const home = process.env.USERPROFILE ?? process.env.HOME ?? '';
  const appData = process.env.APPDATA ?? (home ? path.join(home, 'AppData', 'Roaming') : '');
  const candidates: string[] = [];
  // 1. Stored PlaylistVault default (best).
  try {
    const settingsFile = path.join(appData, 'PlaylistVault', 'settings.json');
    const raw = fs.readFileSync(settingsFile, 'utf8');
    const parsed = JSON.parse(raw) as { defaultDestination?: string };
    if (parsed.defaultDestination) candidates.push(parsed.defaultDestination);
  } catch {
    // fall through to conventional folders
  }
  // 2. Conventional download folder.
  const downloads = process.env.USERPROFILE
    ? path.join(process.env.USERPROFILE, 'Downloads', 'PlaylistVault')
    : path.join(home, 'Downloads', 'PlaylistVault');
  candidates.push(downloads);
  return candidates;
}

export function resolveVaultDestination(): string {
  const [first] = playlistVaultDestinations();
  const dest = first ?? path.join(process.cwd(), 'PlaylistVault');
  fs.mkdirSync(dest, { recursive: true });
  return dest;
}

/**
 * Auto-handoff: copy finished _en.mp4 (+ .srt) into PlaylistVault's folder,
 * append a compatible history entry, and focus PlaylistVault via protocol.
 * Returns the deep link so the renderer can show it when auto-send is OFF.
 */
export function handoffToPlaylistVault(h: VaultHandoff): { deepLink: string; savedPath: string } {
  const dest = resolveVaultDestination();
  const fileName = safeFilename(h.edubFileName);
  const savedPath = resolveWithin(dest, fileName);
  fs.copyFileSync(h.edubFilePath, savedPath);
  if (h.srtPath && fs.existsSync(h.srtPath)) {
    try {
      fs.copyFileSync(h.srtPath, resolveWithin(dest, fileName.replace(/\.mp4$/i, '.srt')));
    } catch {
      // srt sidecar is best-effort
    }
  }
  appendVaultHistory({ title: h.title, fileName, sourceUrl: h.sourceUrl, destination: dest });
  const deepLink =
    `playlistvault://?url=${encodeURIComponent(h.sourceUrl)}` +
    `&edub=${encodeURIComponent(fileName)}&title=${encodeURIComponent(h.title)}`;
  return { deepLink, savedPath };
}

function appendVaultHistory(entry: { title: string; fileName: string; sourceUrl: string; destination: string }): void {
  try {
    const appData = process.env.APPDATA ?? '';
    if (!appData) return;
    const histFile = path.join(appData, 'PlaylistVault', 'history.json');
    let arr: unknown[] = [];
    try {
      arr = JSON.parse(fs.readFileSync(histFile, 'utf8') as string) as unknown[];
      if (!Array.isArray(arr)) arr = [];
    } catch {
      arr = [];
    }
    arr.push({
      id: `edub-${Date.now().toString(36)}`,
      playlistTitle: entry.title,
      sourceUrl: entry.sourceUrl,
      destination: entry.destination,
      videosCompleted: 1,
      videosFailed: 0,
      finishedAt: new Date().toISOString(),
      via: 'EduDub'
    });
    const tmp = `${histFile}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(arr, null, 2), 'utf8');
    fs.renameSync(tmp, histFile);
  } catch {
    // history is best-effort; the file on disk is the source of truth
  }
}

export function openPlaylistVault(deepLink: string): void {
  void shell.openExternal(deepLink);
}
