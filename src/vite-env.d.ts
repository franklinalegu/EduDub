/// <reference types="vite/client" />
interface EdubBridge {
  system: {
    openExternal: (url: string) => Promise<void>;
    chooseFile: () => Promise<{ ok: boolean; data?: string; error?: string }>;
    chooseFolder: (current?: string) => Promise<{ ok: boolean; data?: string; error?: string }>;
    appVersion: () => Promise<string>;
  };
  jobs: {
    runLocalFile: (inputPath: string, title: string) => Promise<{ ok: boolean; data?: unknown; error?: string }>;
    onStage: (cb: (s: unknown) => void) => () => void;
  };
}
declare global {
  interface Window {
    edub?: EdubBridge;
  }
}
export {};
