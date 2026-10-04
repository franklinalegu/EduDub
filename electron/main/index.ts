import { app, BrowserWindow, shell, dialog, ipcMain, protocol } from 'electron';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runLocalDubPipeline } from '../../backend/pipeline/stages.js';
import { handoffToPlaylistVault, openPlaylistVault, resolveVaultDestination } from '../../backend/vault/handoff.js';
import { safeFilename } from '../../backend/util/sanitize.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, '../..');
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
const PRELOAD = path.join(process.env.APP_ROOT, 'dist-electron/preload/index.cjs');
const DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let mainWindow: BrowserWindow | null = null;
let pendingProtocolUrl: string | null = process.argv.find((a) => a.startsWith('edudub://')) ?? null;

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 1024,
    minHeight: 680,
    show: false,
    backgroundColor: '#04120A',
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#04120A00', symbolColor: '#BBF7D0', height: 40 },
    webPreferences: {
      preload: PRELOAD,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true
    }
  });
  win.once('ready-to-show', () => win.show());
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) void shell.openExternal(url);
    return { action: 'deny' };
  });
  if (DEV_SERVER_URL) void win.loadURL(DEV_SERVER_URL);
  else void win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  return win;
}

function edubWorkDir(): string {
  const dir = path.join(os.tmpdir(), 'edudub');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

ipcMain.handle('edub:version', () => app.getVersion());
ipcMain.handle('edub:open-external', (_e, url: string) => {
  if (typeof url === 'string' && /^(https?:\/\/|playlistvault:\/\/)/.test(url)) void shell.openExternal(url);
});
ipcMain.handle('edub:choose-file', async () => {
  const r = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Video', extensions: ['mp4', 'mkv', 'webm', 'mov'] }] });
  if (r.canceled || r.filePaths.length === 0) return { ok: false };
  return { ok: true, data: r.filePaths[0] };
});
ipcMain.handle('edub:choose-folder', async (_e, current?: string) => {
  const r = await dialog.showOpenDialog({ properties: ['openDirectory'], defaultPath: current });
  if (r.canceled || r.filePaths.length === 0) return { ok: false };
  return { ok: true, data: r.filePaths[0] };
});

ipcMain.handle('edub:run-local-file', async (e, inputPath: string, title: string) => {
  try {
    const outDir = path.join(edubWorkDir(), safeFilename(title || 'lesson'));
    const emit = (stage: string, progress: number, message: string): void => {
      e.sender.send('edub:stage', { stage, progress, message });
    };
    const { videoPath, srtPath } = await runLocalDubPipeline(inputPath, outDir, title || 'lesson', {
      onStage: (s, p, m) => emit(s, p, m)
    });
    // Auto-send reads EduDub settings file for the toggle; default ON.
    let autoSend = true;
    try {
      const raw = fs.readFileSync(path.join(app.getPath('userData'), 'settings.json'), 'utf8');
      autoSend = (JSON.parse(raw) as { autoSendToPlaylistVault?: boolean }).autoSendToPlaylistVault ?? true;
    } catch {
      autoSend = true;
    }
    const base = path.basename(videoPath);
    if (autoSend) {
      const { deepLink, savedPath } = handoffToPlaylistVault({
        sourceUrl: inputPath,
        edubFileName: base,
        edubFilePath: videoPath,
        srtPath,
        title: title || base
      });
      emit('handing-off', 100, `Saved via PlaylistVault: ${savedPath}`);
      openPlaylistVault(deepLink);
      return { ok: true, data: { videoPath: savedPath, srtPath, handedOff: true, vaultDir: resolveVaultDestination() } };
    }
    return { ok: true, data: { videoPath, srtPath, handedOff: false } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Pipeline failed.' };
  }
});

protocol.registerSchemesAsPrivileged([{ scheme: 'vault-media', privileges: { standard: true, secure: true, supportFetchAPI: true } }]);

app.whenReady().then(() => {
  if (process.defaultApp) app.setAsDefaultProtocolClient('edudub', process.execPath, [path.resolve(process.argv[1] ?? '')]);
  else app.setAsDefaultProtocolClient('edudub');
  mainWindow = createWindow();
  if (pendingProtocolUrl && mainWindow) {
    const incoming = pendingProtocolUrl;
    mainWindow.webContents.once('did-finish-load', () => mainWindow?.webContents.send('edub:protocol', incoming));
  }
});

app.on('second-instance', (_e, argv) => {
  const incoming = argv.find((a) => a.startsWith('edudub://'));
  if (incoming && mainWindow) mainWindow.webContents.send('edub:protocol', incoming);
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
