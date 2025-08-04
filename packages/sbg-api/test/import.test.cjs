const { expect, describe, it } = require('@jest/globals');
const apis = require('../dist/src/index.cjs');

describe('import tests', () => {
  it('should have default', () => {
    expect(apis).toHaveProperty('default');
  });
  const props = ['getSourcePosts'];
  const libs_wildcards = apis;
  const libs_defaults = apis;

  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    test(`wilcards.${prop} is function`, function () {
      expect(libs_wildcards[prop]).toBeDefined();
      expect(typeof libs_wildcards[prop]).toBe('function');
    }, 10000);
    test(`defaults.${prop} is function`, function () {
      expect(libs_defaults[prop]).toBeDefined();
      expect(typeof libs_defaults[prop]).toBe('function');
    }, 10000);
  }
});
