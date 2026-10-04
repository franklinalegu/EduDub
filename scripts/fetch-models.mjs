/** Model manifest for 100% local inference. Run: npm run fetch:models */
export const MODELS = [
  { name: 'faster-whisper large-v3', use: 'speech-to-text', size: '~3GB' },
  { name: 'NLLB-200-1.3B', use: 'translation to English', size: '~2.6GB' },
  { name: 'MMS-TTS-eng', use: 'English voice dub', size: '~1GB' }
];

console.log('EduDub models (v0.1 stub):');
for (const m of MODELS) console.log(` - ${m.name} [${m.use}, ${m.size}]`);
console.log('\nReal downloads land in v0.2 under %APPDATA%/EduDub/models. Nothing uploads anywhere.');
