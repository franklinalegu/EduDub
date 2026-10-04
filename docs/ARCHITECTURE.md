# Architecture

EduDub is a **standalone** app with two targets, mirroring PlaylistVault:

- **Desktop:** Electron (`electron/main/index.ts`, `electron/preload/index.ts`), `edudub://` protocol, single-instance lock.
- **Web:** Vite build + PWA-able (`src/web/detect.ts` — `isWebBuild()`, `hasNativeBridge()`).

```
EduDub/
├── electron/main/      # lifecycle, IPC, pipeline spawn, PlaylistVault handoff
├── electron/preload/   # frozen window.edub bridge (contextIsolation, no Node in renderer)
├── backend/pipeline/   # stages.ts — transcribe -> translate -> voice -> mux
├── backend/vault/      # handoff.ts — save to PlaylistVault + deep link
├── backend/util/       # sanitize.ts — filenames, paths, URL allow-list, prose filter
├── shared/             # types.ts (EduJob, EduStage), format.ts
└── src/                # React: pages (Home/Queue/Settings/About), components, contexts
```

**Process model.** Renderer never touches Node or models. It calls `window.edub` IPC; main runs the pipeline and streams `edub:stage` progress. Downloads/pipeline spawn with `shell:false` argv arrays only.

**Settings** persist in localStorage (web) and `%APPDATA%/EduDub/settings.json` (desktop): `autoSendToPlaylistVault` (default true), `keepOriginalAudio`, `createSrt`, `defaultDestination`.
