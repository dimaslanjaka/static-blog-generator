import defaults, * as wilcards from '../src';

describe('check method', () => {
  const props = ['chain', 'debug'];

  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    test(`check wilcards.${prop} properties`, function () {
      expect(wilcards[prop]).toBeDefined();
      expect(typeof wilcards[prop]).toBe('function');
    }, 10000);
    test(`check defaults.${prop} properties`, function () {
      expect(defaults[prop]).toBeDefined();
      expect(typeof defaults[prop]).toBe('function');
    }, 10000);
  }
});
