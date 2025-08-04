import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import fs from 'fs-extra';
import gulp from 'gulp';
import url from 'node:url';
import path from 'path';
import { chain as chainDist } from '../../dist/utils/chain.mjs';
import { chain as chainSrc } from '../../src/utils/chain';

/**
 * Sleep for a given number of milliseconds.
 * @param ms - Milliseconds to sleep
 * @returns Promise<void>
 */
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cwd = path.join(__dirname, '../fixtures');
const dest = path.join(__dirname, '../../tmp');

jest.setTimeout(60000);

type ChainImpl = typeof chainSrc;

function runChainTests(chain: ChainImpl, label: string) {
  describe(`${label} chain`, () => {
    beforeEach(() => {
      jest.clearAllMocks();
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
      expect(logSpy).toHaveBeenCalledWith('async done');
      logSpy.mockRestore();
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
}

runChainTests(chainSrc, 'src');
runChainTests(chainDist, 'dist');
