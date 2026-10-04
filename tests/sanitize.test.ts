import { describe, it, expect } from 'vitest';
import { safeFilename, resolveWithin, parseVideoUrl, isTranslatableProse } from '../backend/util/sanitize';

describe('sanitize', () => {
  it('strips illegal filename chars', () => {
    expect(safeFilename('a/b:c*d?e')).toBe('abcde');
  });
  it('rejects path escape', () => {
    expect(() => resolveWithin('/tmp/out', '../evil.mp4')).toThrow();
  });
  it('accepts youtube urls only', () => {
    expect(parseVideoUrl('https://www.youtube.com/watch?v=x').valid).toBe(true);
    expect(parseVideoUrl('https://evil.example/x').valid).toBe(false);
  });
  it('protects code from translation', () => {
    expect(isTranslatableProse('npm install edudub')).toBe(false);
    expect(isTranslatableProse('Welcome to this tutorial.')).toBe(true);
  });
});
