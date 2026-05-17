import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import { LocalStorageSharedPreferences } from '../../src/utils/LocalStorageSharedPreferences.js';

describe('LocalStorageSharedPreferences', () => {
  const namespace = 'jestTest';
  let prefs: LocalStorageSharedPreferences;

  beforeEach(() => {
    prefs = new LocalStorageSharedPreferences(namespace);
    prefs.clear();
  });

  afterEach(() => {
    prefs.clear();
  });

  it('should store and retrieve a string', () => {
    prefs.putString('foo', 'bar');
    expect(prefs.getString('foo')).toBe('bar');
  });

  it('should return default value for missing string', () => {
    expect(prefs.getString('missing', 'default')).toBe('default');
  });

  it('should store and retrieve an integer', () => {
    prefs.putInt('num', 42);
    expect(prefs.getInt('num')).toBe(42);
  });

  it('should return default value for missing integer', () => {
    expect(prefs.getInt('missing', 99)).toBe(99);
  });

  it('should store and retrieve a boolean', () => {
    prefs.putBoolean('flag', true);
    expect(prefs.getBoolean('flag')).toBe(true);
    prefs.putBoolean('flag', false);
    expect(prefs.getBoolean('flag')).toBe(false);
  });

  it('should return default value for missing boolean', () => {
    expect(prefs.getBoolean('missing', true)).toBe(true);
  });

  it('should remove a key', () => {
    prefs.putString('foo', 'bar');
    prefs.remove('foo');
    expect(prefs.getString('foo')).toBeUndefined();
  });

  it('should clear all keys in the namespace', () => {
    prefs.putString('a', '1');
    prefs.putString('b', '2');
    prefs.clear();
    expect(prefs.getString('a')).toBeUndefined();
    expect(prefs.getString('b')).toBeUndefined();
  });
});
