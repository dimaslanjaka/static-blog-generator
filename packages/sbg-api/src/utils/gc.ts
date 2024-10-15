let logged = false;
export function forceGc() {
  if (typeof global.gc === 'function') {
    global.gc();
  } else {
    if (!logged) {
      console.warn('Garbage collection is not exposed. Use --expose-gc');
      logged = true;
    }
  }
}
