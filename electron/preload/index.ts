import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('edub', {
  system: {
    openExternal: (url: string): Promise<void> => ipcRenderer.invoke('edub:open-external', url),
    chooseFile: (): Promise<{ ok: boolean; data?: string; error?: string }> => ipcRenderer.invoke('edub:choose-file'),
    chooseFolder: (current?: string): Promise<{ ok: boolean; data?: string; error?: string }> =>
      ipcRenderer.invoke('edub:choose-folder', current),
    appVersion: (): Promise<string> => ipcRenderer.invoke('edub:version')
  },
  jobs: {
    runLocalFile: (inputPath: string, title: string): Promise<{ ok: boolean; data?: unknown; error?: string }> =>
      ipcRenderer.invoke('edub:run-local-file', inputPath, title),
    onStage: (cb: (s: unknown) => void): (() => void) => {
      const fn = (_e: unknown, payload: unknown): void => cb(payload);
      ipcRenderer.on('edub:stage', fn);
      return () => ipcRenderer.removeListener('edub:stage', fn);
    }
  }
});
