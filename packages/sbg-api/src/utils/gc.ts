export function forceGc() {
  if (typeof global.gc === 'function') {
    global.gc();
  } else {
    console.warn('Garbage collection is not exposed. Use --expose-gc');
  }
}
