import { execSync } from 'child_process';
import * as glob from 'glob';
import path from 'path';

const files = glob.sync('src/**/*.builder.*', { nodir: true });
const commands = files.map((file) => {
  const ext = path.extname(file);
  if (ext === '.ts') {
    return `node --no-warnings --experimental-specifier-resolution=node --loader ts-node/esm -r dotenv/config "${file}"`;
  }
  return `node --no-warnings --experimental-specifier-resolution=node -r dotenv/config "${file}"`;
});
for (const command of commands) {
  console.log(`Executing: ${command}`);
  execSync(command, { stdio: 'inherit' });
}
