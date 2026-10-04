# PlaylistVault integration (dub-then-save)

EduDub converts first, PlaylistVault saves. PlaylistVault is never forked — EduDub hands it finished files.

## Flow

1. User pastes a link in EduDub (or picks a local file).
2. EduDub downloads to its own temp (links) and runs the local pipeline.
3. Preview English `_en.mp4 + .srt`.
4. If `Settings → Auto-send to PlaylistVault` is **ON** (default):
   - copy `_en.mp4 (+ .srt)` into PlaylistVault's destination (stored setting, else `Downloads/PlaylistVault/`);
   - append a compatible history entry (atomic temp-file + rename);
   - `shell.openExternal('playlistvault://?url=<orig>&edub=<file>&title=<t>')` — PlaylistVault focuses, toasts, shows the file. No re-download.
5. If **OFF**: show `[Open in PlaylistVault]` + `[Reveal file]` buttons only.

## PlaylistVault-side change (included in plan)

`electron/main/index.ts → acceptProtocolUrl()`: today only `?url=` YouTube links. Extend to accept `&edub=` filename + `&title=`:

- validate URL allow-list + `safeFilename()` + `resolveWithin(destination)` (reject `..`, absolute paths, system roots);
- if file exists on disk: emit `IPC.edubImport`, add history entry, skip re-analysis;
- else fall back to current `?url=` analyze behavior.

## Web upsell

In EduDub web builds (`isWebBuild() && !hasNativeBridge()`), `GetPlaylistVault.tsx` recommends PlaylistVault for any YouTube playlist/channel/mTi-video content, linking to `github.com/franklinalegu/playlistvault/releases`.
