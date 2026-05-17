/**
 * @jest-environment jsdom
 */

import '../dist/browser/index-browser.mjs';

test('global utilities exist', () => {
  console.log(globalThis.SBGUtility);
  console.log(window.SBGUtility);
  console.log(globalThis.array_shuffle);

  expect(globalThis.SBGUtility).toBeDefined();
  expect(globalThis.array_shuffle).toBeDefined();
});

test('debug globals', async () => {
  await import('../dist/browser/index-browser.mjs');

  console.log('SBG:', globalThis.SBGUtility);
  console.log('shuffle:', globalThis.array_shuffle);

  expect(globalThis.SBGUtility?.array_shuffle).toBeDefined();
});
