import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type { EduJob, EduSegment } from '../../shared/types.js';
import { formatSrtTime } from '../../shared/format.js';
import { isTranslatableProse, safeFilename } from '../util/sanitize.js';

export interface PipelineEvents {
  onStage: (stage: EduJob['stage'], progress: number, message: string) => void;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Local pipeline stub (v0.1): same stage order as the real
 * faster-whisper -> NLLB -> TTS -> ffmpeg pipeline, with real .srt writing
 * and real output-folder layout. Swap each stage for real model calls in v0.2.
 *
 * Real pipeline order (docs/PIPELINE.md):
 * ffmpeg wav 16k -> faster-whisper large-v3 -> NLLB-200-1.3B -> MMS/Coqui TTS -> ffmpeg mux
 */
export async function runLocalDubPipeline(
  inputPath: string,
  outDir: string,
  title: string,
  events: PipelineEvents
): Promise<{ videoPath: string; srtPath: string; segments: EduSegment[] }> {
  fs.mkdirSync(outDir, { recursive: true });
  const base = safeFilename(title);
  const srtPath = path.join(outDir, `${base}_en.srt`);
  const videoPath = path.join(outDir, `${base}_en.mp4`);

  events.onStage('transcribing', 8, 'Transcribing speech locally (faster-whisper)…');
  await sleep(600);
  // Stub segments — replaced by real whisper output in v0.2.
  const raw: Array<[number, number, string]> = [
    [0, 4, 'Welcome to this tutorial.'],
    [4, 9, 'Today we will walk through the lesson step by step.']
  ];
  events.onStage('translating', 42, 'Translating to English locally (NLLB)…');
  await sleep(600);

  const segments: EduSegment[] = raw.map(([s, e, text], i) => ({
    id: `seg-${i + 1}`,
    startSeconds: s,
    endSeconds: e,
    sourceText: text,
    englishText: isTranslatableProse(text) ? text : text
  }));

  const srt = segments
    .map((g, i) => `${i + 1}\n${formatSrtTime(g.startSeconds)} --> ${formatSrtTime(g.endSeconds)}\n${g.englishText}\n`)
    .join('\n');
  fs.writeFileSync(srtPath, srt, 'utf8');

  events.onStage('voicing', 68, 'Synthesizing English voice locally (TTS)…');
  await sleep(600);
  events.onStage('muxing', 86, 'Muxing dubbed audio + subtitles (ffmpeg)…');

  // v0.1: copy input as output carrier so the file exists and plays.
  // v0.2 replaces this with real ffmpeg dub mix + subtitle mux.
  await copyOrTouch(inputPath, videoPath);
  events.onStage('ready', 100, 'English version ready.');
  return { videoPath, srtPath, segments };
}

async function copyOrTouch(inputPath: string, videoPath: string): Promise<void> {
  try {
    if (fs.existsSync(inputPath)) {
      fs.copyFileSync(inputPath, videoPath);
      return;
    }
  } catch {
    // fall through to marker file
  }
  fs.writeFileSync(videoPath, `EduDub v0.1 placeholder dub for ${path.basename(inputPath)}\n`, 'utf8');
}

export function ffmpegArgsForMux(video: string, dubbedAudio: string, srt: string, out: string, keepOriginal: boolean): string[] {
  // Documented real mux (see docs/PIPELINE.md). No shell — argv array only.
  if (keepOriginal) {
    return ['-i', video, '-i', dubbedAudio, '-filter_complex', '[1:a]volume=1.0[dub];[0:a]volume=0.25[orig];[dub][orig]amix=inputs=2[a]', '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', out];
  }
  void srt;
  return ['-i', video, '-i', dubbedAudio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-shortest', out];
}

export function spawnTo(_cmd: string, _args: string[]): Promise<void> {
  void spawn;
  return Promise.resolve();
}
