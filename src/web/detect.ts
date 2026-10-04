export function isElectronRenderer(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    /Electron/i.test(navigator.userAgent) &&
    typeof (window as unknown as { edub?: unknown }).edub !== 'undefined'
  );
}

/** True when running as hosted web build (http/https, not Electron). */
export function isWebBuild(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.location.protocol === 'file:') return false;
  if (isElectronRenderer()) return false;
  return true;
}

export function hasNativeBridge(): boolean {
  return typeof (window as unknown as { edub?: unknown }).edub !== 'undefined';
}
