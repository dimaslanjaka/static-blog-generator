///
import { testCwd } from '../env';
process.cwd = () => testCwd;
///

import { spawn } from 'child_process';
import path from 'upath';

/**
 * Programmatically set arguments and execute the CLI script
 *
 * @param args - positional and option arguments for the command to run
 * @returns
 */
export function tsCmd(...args: string[]): Promise<string> {
  // const p = spawn('npx', ['ts-node', path.resolve(__dirname + '/../../src/cli.ts'), ...args], {
  //   cwd: __dirname,
  //   shell: true
  // });
  const p = spawn(
    'node',
    [
      '--no-warnings',
      '--experimental-specifier-resolution=node',
      '--loader',
      'ts-node/esm',
      '-r',
      'dotenv/config',
      path.resolve(__dirname + '/../../src/cli.ts'),
      ...args
    ],
    {
      cwd: __dirname,
      shell: true
    }
  );
  return new Promise((resolveFunc) => {
    const output = [] as string[];
    p.stdout.on('data', (x) => {
      output.push(x.toString());
      // process.stdout.write(x.toString());
    });
    p.stderr.on('data', (x) => {
      output.push(x.toString());
      // process.stderr.write(x.toString());
    });
    p.on('exit', (_code) => {
      resolveFunc(output.join('\n'));
    });
  });
}
