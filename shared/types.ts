export type EduStage =
  | 'queued'
  | 'analyzing'
  | 'downloading'
  | 'transcribing'
  | 'translating'
  | 'voicing'
  | 'muxing'
  | 'ready'
  | 'handing-off'
  | 'completed'
  | 'failed'
  | 'paused';

export interface EduSegment {
  id: string;
  startSeconds: number;
  endSeconds: number;
  sourceText: string;
  englishText: string;
}

export interface EduJob {
  id: string;
  sourceUrl: string;
  title: string;
  stage: EduStage;
  progress: number;
  message: string;
  segments: EduSegment[];
  outputVideoPath: string | null;
  outputSrtPath: string | null;
  sendToVaultAfterDub: boolean;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EduSettings {
  autoSendToPlaylistVault: boolean;
  defaultDestination: string;
  targetLanguage: 'en';
  keepOriginalAudio: boolean;
  createSrt: boolean;
}

export const DEFAULT_SETTINGS: EduSettings = {
  autoSendToPlaylistVault: true,
  defaultDestination: '',
  targetLanguage: 'en',
  keepOriginalAudio: true,
  createSrt: true
};

export interface VaultHandoff {
  sourceUrl: string;
  edubFileName: string;
  edubFilePath: string;
  srtPath: string | null;
  title: string;
}

export const IPC = {
  edubImport: 'edub:import',
  protocolUrlDetected: 'protocol:url-detected'
} as const;
