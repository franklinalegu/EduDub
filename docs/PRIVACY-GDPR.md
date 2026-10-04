# Privacy & GDPR policy

**Controller:** Franklin Alegu (FA) — contact via the EduDub GitHub repository.

## 1. Local-first — no tracking by design

EduDub processes everything **on your device**: transcription, translation, voice synthesis and muxing run locally. EduDub:

- has no accounts, no analytics, no telemetry, no advertising identifiers;
- never uploads videos, audio, transcripts or settings to any server;
- stores settings/history only on your device (`%APPDATA%/EduDub/`, browser localStorage for the web build).

## 2. Personal data you may process

When you convert a video, EduDub handles data **you** provide (URLs, filenames, speech content). You are the controller of that data. Lawful bases you may rely on include consent of the rights holder, licence terms, or legitimate educational use where applicable. Only process content you are allowed to use (see `RESPONSIBLE-USE.md` and `EDUCATION-NOTICE.md`).

Voice data: speech recognition runs locally; voiceprints never leave your machine. Do not use another person's voice to mislead or impersonate.

## 3. Your rights (EU/UK GDPR)

Because EduDub stores nothing centrally, there is nothing to request from the developer. On your own device you can, at any time:

- **access / port** — read `%APPDATA%/EduDub/settings.json`, history and output files;
- **rectify** — edit settings or rename outputs;
- **erase** — delete outputs, temp files (`%TEMP%/edudub`), settings and history;
- **restrict / object** — turn off `Auto-send to PlaylistVault`, use EduDub fully offline;
- **withdraw consent** — stop using the app and delete local data.

Complaints: contact your national supervisory authority (e.g. the ICO in the UK, or your EU member-state DPA).

## 4. Handoff to PlaylistVault

With auto-send ON, EduDub copies finished files into PlaylistVault's folder on the **same device** and opens it via a local `playlistvault://` deep link. No data is sent over the network by this handoff.

## 5. Security

- No shell execution of user content; explicit argv arrays only.
- URL allow-listing, filename sanitising, path containment (`resolveWithin`).
- Renderer sandbox: `contextIsolation: true`, `nodeIntegration: false`.

## 6. Retention

Local outputs persist until you delete them. Temp conversion files should be cleaned by the app; you may delete `%TEMP%/edudub` manually at any time.

## 7. Changes

Material privacy changes will be noted in release notes and this file. Last updated: 2026-10-04.
