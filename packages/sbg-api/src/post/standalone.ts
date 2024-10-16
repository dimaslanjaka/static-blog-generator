import * as crossSpawn from 'cross-spawn';
import { globSync } from 'glob';
import path from 'node:path';
import { getConfig, Logger, replacePath, resolveCommand, sbgDebug } from 'sbg-utility';
import upath from 'upath';

const log = sbgDebug('post[standalone]');

async function standalone(config: ReturnType<typeof getConfig>) {
  const postCwd = path.join(config.cwd, config.post_dir);
  const scripts = globSync('**/*.standalone.{js,cjs,mjs,ts}', {
    cwd: postCwd,
    ignore: ['**/tmp/**'],
    dot: true,
    absolute: true
  });

  log('Processing', scripts.length, 'script(s)');

  const spawnNode = async function (file: string) {
    const cmd = file.endsWith('.ts') ? resolveCommand('ts-node') : 'node';
    Logger.log('='.repeat(10) + ' input ' + '='.repeat(10));
    Logger.log(`${cmd} ${await replacePath(file, postCwd, '')}`);
    Logger.log('='.repeat(10) + ' ouput ' + '='.repeat(10));
    await crossSpawn.spawnAsync(cmd, [file], { stdio: 'inherit', cwd: postCwd });
  };

  while (scripts.length > 0) {
    const script = scripts.shift()!;
    await spawnNode(script);
  }
}

/**
 * run all _*.standalone.js inside src-posts (_config_yml.post_dir)
 * @returns
 */
async function standaloneRunner(config: ReturnType<typeof getConfig>) {
  console.log('sdsdsd');
  const postCwd = upath.join(config.cwd, config.post_dir);
  Logger.log(`[standalone] Running scripts on ${postCwd}\n`);
  console.log(postCwd);
  try {
    await standalone(config);
  } catch (e) {
    console.error(e);
  }
}

export default standaloneRunner;
