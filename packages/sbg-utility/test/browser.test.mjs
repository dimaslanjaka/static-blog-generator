/**
 * @jest-environment jsdom
 */

import { beforeAll, describe, expect, test } from '@jest/globals';

// Defer loading the browser bundle until we define module/exports for UMD compatibility in Node ESM
beforeAll(async () => {
  if (typeof globalThis.module === 'undefined') globalThis.module = {};
  if (typeof globalThis.exports === 'undefined') globalThis.exports = {};
  await import('../dist/browser/index.mjs');
});

describe('Browser bundle', () => {
  test('should export expected functions', () => {
    const funcs = [
      'array_shuffle',
      'array_random',
      'array_unique',
      'array_flatten',
      'rand',
      'toMilliseconds',
      'decodeURL',
      'encodeURL',
      'isClass',
      'getClassName',
      'getFunctionName',
      'noop',
      'delay',
      'slugify',
      'cleanString'
    ];

    const missing = [];
    for (const func of funcs) {
      const g = typeof globalThis[func] === 'function';
      const w = typeof window[func] === 'function';
      if (!g || !w) missing.push(func + ` (global:${typeof globalThis[func]}, window:${typeof window[func]})`);
    }

    if (missing.length) {
      console.error('Missing exported globals:', missing);
    }

    expect(missing.length).toBe(0);
  });

  test('global utilities exist', () => {
    expect(globalThis.SBGUtility).toBeDefined();
    expect(globalThis.array_shuffle).toBeDefined();
    expect(window.SBGUtility).toBeDefined();
  });

  test('debug globals', async () => {
    await import('../dist/browser/index.mjs');

    // console.log('SBG:', globalThis.SBGUtility);
    // console.log('shuffle:', globalThis.array_shuffle);

    expect(globalThis.SBGUtility?.array_shuffle).toBeDefined();
  });
});
