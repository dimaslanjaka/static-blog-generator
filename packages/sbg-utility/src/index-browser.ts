import * as wildcards from './index-exports-browser.js';
export * from './index-exports-browser.js';
export default wildcards;

globalThis.SBGUtility = globalThis.SBGUtility || {};
Object.assign(globalThis.SBGUtility, wildcards);

if (typeof window !== 'undefined') {
  window.SBGUtility = window.SBGUtility || {};
  Object.assign(window.SBGUtility, wildcards);
  // Expose all functions directly on window
  Object.assign(window, wildcards);
}
