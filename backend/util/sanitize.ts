import path from 'node:path';

/** Strip illegal filename characters, collapse whitespace, cap length. */
export function safeFilename(name: string, maxLen = 120): string {
  const cleaned = name
    .replace(/[\\/:*?"<>|#%{}$!'@+`=]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.\s]+$/g, '');
  const escaped = cleaned.replace(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i, '_$1$2');
  return escaped.slice(0, maxLen) || 'EduDub';
}

/** Reject paths escaping the destination folder. */
export function resolveWithin(destination: string, entry: string): string {
  const base = path.resolve(destination);
  const target = path.resolve(base, entry);
  if (target !== base && !target.startsWith(base + path.sep)) {
    throw new Error('Path escapes destination folder.');
  }
  return target;
}

const YT_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtu.be']);

export function parseVideoUrl(raw: string): { valid: boolean; normalized?: string } {
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return { valid: false };
    const host = u.hostname.toLowerCase();
    if (!YT_HOSTS.has(host) && !host.endsWith('.youtube.com')) return { valid: false };
    return { valid: true, normalized: u.toString() };
  } catch {
    return { valid: false };
  }
}

/** Never translate code/commands/paths — only prose. */
export function isTranslatableProse(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (/^(npm|pip|docker|git|ffmpeg|yt-dlp|node|python|cd|ls|mkdir)\s/i.test(t)) return false;
  if (/^[a-zA-Z]:\\|^\/[\w-]+|^\.\//.test(t)) return false;
  if (/^(def |class |import |export |const |function |#include)/.test(t)) return false;
  if (/[{}`;]{2,}/.test(t) && t.split(' ').length < 6) return false;
  return true;
}
