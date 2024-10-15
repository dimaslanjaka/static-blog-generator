import fs from 'fs-extra';
import pLimit from 'p-limit';
import { debug, normalizePath } from 'sbg-utility';

/**
 * log debug
 *
 * @example
 * cross-env-shell DEBUG=* "your commands"
 */
const log = debug('post');
const logErr = log.extend('error');

export function processFile(
  filePath: string,
  onComplete: (content: string) => void | Promise<void>,
  onError: (err: Error) => void | Promise<void>
) {
  const chunks: string[] = []; // Array to store chunks
  filePath = normalizePath(filePath);
  const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

  readStream.on('data', (chunk) => {
    // Store each chunk of data
    if (Buffer.isBuffer(chunk)) {
      chunks.push(Buffer.from(chunk).toString());
    } else {
      chunks.push(chunk);
    }
  });

  readStream.on('end', () => {
    const fullContent = chunks.join(''); // Concatenate all chunks
    log('File processed:', filePath);

    // Call onComplete and handle async resolution outside of the Promise executor
    Promise.resolve(onComplete(fullContent)).catch((err) => {
      logErr('Error in onComplete:', filePath, err);
    });
  });

  readStream.on('error', (err) => {
    logErr('Error reading file:', filePath, err);

    // Call onError and handle async resolution outside of the Promise executor
    Promise.resolve(onError(err)).catch((error) => {
      logErr('Error in onError:', filePath, error);
    });
  });
}

const limit = pLimit(10); // Limit concurrency to 10 tasks

export async function processFiles(
  filePaths: string[],
  onComplete: (filePath: string, content: string) => void | Promise<void>,
  onError: (filePath: string, err: Error) => void | Promise<void>
) {
  const promises = filePaths
    .map((s) => normalizePath(s))
    .map((filePath) =>
      limit(
        () =>
          new Promise<void>((resolve) => {
            processFile(
              filePath,
              (content) => {
                Promise.resolve(onComplete(filePath, content)).then(() => {
                  resolve();
                });
              },
              (err) => {
                Promise.resolve(onError(filePath, err)).then(() => {
                  resolve();
                });
              }
            );
          })
      )
    );
  await Promise.all(promises);
}
