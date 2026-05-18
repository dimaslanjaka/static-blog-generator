import { spawn } from 'child_process';
import minimist from 'minimist';

/**
 * Correct Windows-safe Yarn runner
 */
function yarn(args, stdio = 'inherit') {
  if (process.platform === 'win32') {
    return spawn('cmd.exe', ['/c', 'yarn', ...args], {
      stdio
    });
  }

  return spawn('yarn', args, {
    stdio
  });
}

/**
 * Workspace check (Yarn Berry safe)
 */
function workspaceExists(name) {
  return new Promise((resolve, reject) => {
    const child = yarn(['workspaces', 'list', '--json'], ['ignore', 'pipe', 'inherit']);

    let buffer = '';
    let found = false;

    child.stdout.on('data', (chunk) => {
      buffer += chunk.toString();

      let lines = buffer.split('\n');

      // keep last incomplete line in buffer
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const obj = JSON.parse(line);

          if (obj.name === name) {
            found = true;
            child.kill();
            resolve(true);
            return;
          }
        } catch {
          // ignore partial JSON
        }
      }
    });

    child.on('close', () => {
      resolve(found);
    });

    child.on('error', (err) => {
      reject(new Error(`Yarn failed: ${err.message}`));
    });
  });
}

/**
 * Run yarn command
 */
function runYarn(args) {
  return new Promise((resolve, reject) => {
    const child = yarn(args);

    child.on('error', (err) => {
      reject(new Error(`Yarn spawn failed: ${err.message}`));
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Yarn failed with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

/**
 * CLI
 */
const args = minimist(process.argv.slice(2), {
  boolean: ['help', 'build', 'clean'],
  string: ['workspace'],
  alias: { h: 'help', b: 'build', c: 'clean' }
});

const workspaceName = args._[0] || args.workspace;

if (args.help || !workspaceName) {
  console.log(`
Usage: node build.mjs [options] <workspace>

Options:
  -h, --help
  -b, --build
  -c, --clean

Example:
  node build.mjs sbg-utility --build
`);
  process.exit(0);
}

async function main() {
  const exists = await workspaceExists(workspaceName);

  if (!exists) {
    console.error(`Workspace "${workspaceName}" not found.`);
    process.exit(1);
  }

  if (args.clean) {
    await runYarn(['workspace', workspaceName, 'run', 'clean']);
    return;
  }

  if (args.build) {
    await runYarn(['workspace', workspaceName, 'run', 'build']);
    return;
  }

  console.error('No action specified.');
  process.exit(1);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
