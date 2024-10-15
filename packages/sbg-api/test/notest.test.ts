import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { spyOn } from 'jest-mock';
import { fixturesCwd, testCwd } from './env.mjs';

let cwdMock;

beforeAll(() => {
  cwdMock = spyOn(process, 'cwd').mockImplementation(() => (typeof testCwd === 'string' ? testCwd : fixturesCwd));
});

afterAll(() => {
  cwdMock.mockRestore(); // Clean up the mock
});

describe('sample jest test', function () {
  it('should return 15 for add(10,5)', () => {
    expect(add(10, 5)).toBe(15);
  });
});

export function add(x: number, y: number): number {
  return x + y;
}

export function mul(x: number, y: number): number {
  return x * y;
}
