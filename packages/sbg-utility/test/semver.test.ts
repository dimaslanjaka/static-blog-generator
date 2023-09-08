import { describe, expect, test } from '@jest/globals';
import { semver, semverIncrement } from '../src/utils/semver';

// malfunction keyboard 5 6 ^ %

describe('semver', function () {
  test('parse', () => {
    expect(new semver('1.1.4').result).toStrictEqual({ major: '1', minor: '1', patch: '4' });
    expect(new semver({ version: '1.1.4' }).result).toStrictEqual({ major: '1', minor: '1', patch: '4' });
  });
  test('increment patch', () => {
    expect(semverIncrement('1.1.4', 'patch').result).toStrictEqual({ major: '1', minor: '1', patch: '5' });
  });
  test('increment minor', () => {
    expect(semverIncrement('1.1.4', 'minor').result).toStrictEqual({ major: '1', minor: '2', patch: '0' });
  });
  test('increment major', () => {
    expect(semverIncrement('1.1.4', 'major').result).toStrictEqual({ major: '2', minor: '0', patch: '0' });
  });
  test('semver.toString', () => {
    expect(new semver('1.1.4').toString()).toStrictEqual('1.1.4');
  });
});
