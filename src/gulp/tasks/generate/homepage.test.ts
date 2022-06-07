import MeasureTime from '../../../node/benchmark/measure-timing';
import spawner from '../../../node/spawner';
import { post_chunks } from '../../../parser/post/postMapper';
import { post_generated_dir } from '../../../types/_config';
import { generateAssets } from '../generate-assets';
import { generateTemplate } from '../generate-template';
import { generateIndex } from './homepage';

const measure = new MeasureTime();

measure
  .run('generate assets', generateAssets)
  .then((m) => m.run('generate template', generateTemplate))
  .then((m) => m.run('generate homepage', generateIndex(post_chunks())))
  //.then((m) => m.run('generate tags', generateIndex(getChunkOf('tag'))))
  .then((m) => m.run('npm install', installNpm));

/*

measure
  //.run('generate homepage', generateIndex, 'homepage')
  //.then(() => measure.run('generate all archive', generateIndex, 'all'))
  //.then(() => measure.run('generate archive page 1', generateIndex, 1))
  .run('generate tags', generateIndex, getChunkOf)
  .then((c) => c.run('npm install public directory', installNpm));*/

function installNpm() {
  return spawner.promise(
    { cwd: post_generated_dir, stdio: 'inherit' },
    'npm',
    'install'
  );
}
