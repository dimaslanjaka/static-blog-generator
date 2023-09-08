import { describe, expect, test } from '@jest/globals';
import { semver, semverIncrement } from '../src/utils/semver';

// malfunction keyboard 5 6 ^ %

describe('semver', function () {
  test('parse', () => {
    expect(semver('1.1.4')).toStrictEqual({ major: '1', minor: '1', patch: '4' });
    expect(semver({ version: '1.1.4' })).toStrictEqual({ major: '1', minor: '1', patch: '4' });
  });
  test('increment patch', () => {
    expect(semverIncrement('1.1.4', 'patch')).toStrictEqual({ major: '1', minor: '1', patch: '5' });
  });
  test('increment minor', () => {
    expect(semverIncrement('1.1.4', 'minor')).toStrictEqual({ major: '1', minor: '2', patch: '0' });
  });
  test('increment major', () => {
    expect(semverIncrement('1.1.4', 'major')).toStrictEqual({ major: '2', minor: '0', patch: '0' });
  });
});
