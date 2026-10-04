# Pipeline (100% local)

Order is fixed; UI stages match exactly (`DubStages.tsx`):

1. `analyzing` — probe input, detect source language (first 30s).
2. `downloading` — link inputs only: fetch source to temp via yt-dlp (PlaylistVault pattern).
3. `transcribing` — faster-whisper `large-v3`, VAD on, 16kHz mono wav.
4. `translating` — NLLB-200 (`1.3B` default, `3.3B` optional) to English.
5. `voicing` — MMS / Coqui TTS English voice; gender-matched where detected.
6. `muxing` — ffmpeg: English dub over original (original at 25% volume when `keepOriginalAudio`), `+ .srt` sidecar.
7. `ready` → `handing-off` → `completed`.

**Code-protection rule** (`isTranslatableProse` in `backend/util/sanitize.ts`): never translate shell commands (`npm/docker/git/ffmpeg`), paths (`C:\…`, `/…`, `./…`), or code openers (`def/import/export/const/function`). Only speech, slide prose and UI strings.

**Models** (~7GB total, fetched once via `npm run fetch:models` in v0.2): whisper `~3GB`, NLLB `~2.6GB`, TTS `~1GB`. Nothing uploads anywhere.
