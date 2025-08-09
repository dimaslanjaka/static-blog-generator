import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import fs from 'fs-extra';
import gulp from 'gulp';
import url from 'node:url';
import path from 'path';
import { chain } from '../src/utils/chain';

// Sleep function for the mock
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cwd = path.join(__dirname, 'fixtures');
const dest = path.join(__dirname, 'tmp');

jest.setTimeout(60000);

describe('chain', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test('async', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await chain([
      {
        callback: async () => {
          await sleep(5000);
          console.log('async done');
        }
      }
    ]);

    // Assertions
    expect(logSpy).toHaveBeenCalledWith('async done');

    logSpy.mockRestore(); // Restore original console.log
  });

  test('stream', async () => {
    fs.rmSync(dest, { force: true, recursive: true });

    await chain([
      {
        callback: () => gulp.src('**/*.*', { cwd }).pipe(gulp.dest(dest))
      }
    ]);

    expect(fs.existsSync(dest)).toBeTruthy();
  });
});
