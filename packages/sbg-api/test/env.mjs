import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';
import path from 'upath';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const paths = [
  '/../../../test',
  path.resolve(__dirname + '/../../sbg-cli/test'),
  '/../../../../static-blog-generator-hexo/site',
  '/../../../../hexo-themes'
];

const testCwd = paths
  .map((p) => path.resolve(__dirname + p))
  .find((resolvedPath) => fs.existsSync(path.join(resolvedPath, '_config.yml')));

export const fixturesCwd = path.resolve(__dirname, 'fixtures');
export { testCwd };

process.on('exit', (code) => {
  console.error(`Process exited with code: ${code}`);
});

process.on('SIGINT', () => {
  console.error('Received SIGINT. Exiting...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Received SIGTERM. Exiting...');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  if (!(err instanceof Error)) {
    // If it's not an instance of Error, create one manually to preserve the context.
    err = new Error(String(err));
  }
  console.error('Uncaught Exception:', err, err.track);
  // Send some notification about the error
  process.exit(1);
});
