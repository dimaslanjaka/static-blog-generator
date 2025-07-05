const { chain } = require('../../dist/index.cjs');
const gulp = require('gulp');
const path = require('path');
const fs = require('fs-extra');

// Sleep function for the mock
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const cwd = path.join(__dirname, '../fixtures');
const dest = path.join(__dirname, '../../tmp/chain-dist-test');

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
