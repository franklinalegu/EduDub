# EduDub

Built by **Franklin Alegu (FA)**.

Tutorial videos in another language → English. Local voice dub + English subtitles, saved via PlaylistVault.

> **⚠️ Education purposes only.** EduDub is for converting content you own, content published under a licence that permits reuse, or content you have explicit permission to use. Downloading or converting copyrighted material without authorisation may breach platform Terms of Service and the law where you live. You are responsible for how you use this software. See `docs/EDUCATION-NOTICE.md`.

> **Privacy:** 100% local processing. Nothing uploads anywhere. See `docs/PRIVACY-GDPR.md`.

## What it does

| Input | Output |
|---|---|
| Tutorial video (any language) | `_en.mp4` English voice dub + `.srt` subtitles |
| YouTube / Udemy link | Converted, then auto-saved into PlaylistVault |
| Local `mp4/mkv/webm` | Converted in place, optional handoff |

- **Voice dubbing:** original kept low underneath, English voice over the top.
- **Subtitles:** real `.srt` with timestamps, always on for tutorials.
- **Code protection:** code, terminal commands, paths and variable names are never translated — only prose, UI strings and speech.
- **Auto-send to PlaylistVault:** ON by default, turn off anytime in Settings.

## Quickstart

```bash
npm install
npm run dev        # desktop (Electron)
npm run dev:web    # browser/PWA
npm run typecheck
npm test
```

Convert a local file: open EduDub → **Convert** → *Pick local file + convert*.

## Docs

- `docs/ARCHITECTURE.md` — app shape, web + desktop targets
- `docs/PIPELINE.md` — transcribe → translate → voice → mux
- `docs/PLAYLISTVAULT-INTEGRATION.md` — dub-then-save handoff + protocol change
- `docs/UI-THEME.md` — green gradients, same typography as PlaylistVault
- `docs/RESPONSIBLE-USE.md` — what you may convert
- `docs/PRIVACY-GDPR.md` — GDPR policy, data rights
- `docs/EDUCATION-NOTICE.md` — education-only warning

## Licence

MIT © 2026 Franklin Alegu (FA). Application source only.
