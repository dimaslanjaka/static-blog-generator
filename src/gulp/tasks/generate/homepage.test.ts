import Bluebird from 'bluebird';
import { join } from 'upath';
import MeasureTime from '../../../node/benchmark/measure-timing';
import { write } from '../../../node/filemanager';
import spawner from '../../../node/spawner';
import modifyPost from '../../../parser/post/modifyPost';
import { EJSRenderer } from '../../../renderer/ejs/EJSRenderer';
import config, { post_generated_dir } from '../../../types/_config';
import { generateAssets } from '../generate-assets';
import { generateTemplate } from '../generate-template';
import { getHomepageProperties } from './getArchiveProperties';

const measure = new MeasureTime();

measure
  .run('generate assets', generateAssets)
  .then((m) => m.run('generate template', generateTemplate))
  .then((m) =>
    m.run('generate homepage', () => {
      const opt = Bluebird.all(getHomepageProperties())
        .map((archive) => modifyPost(archive, { merge: true, cache: false }))
        .filter(
          (archive) => archive !== null && typeof archive !== 'undefined'
        );
      write(join(__dirname, 'tmp/homepage/rendered-opt.log'), opt);
      Bluebird.all(opt).each(async (property) => {
        // fix title
        if (property.page_now === 0) {
          property.title = null;
          property.metadata.title = null;
        }
        const pagePath =
          property.page_now > 0
            ? config.archive_dir + '/page/' + property.page_now + '/index.html'
            : 'index.html';
        const saveTo = join(post_generated_dir, pagePath);
        const rendered = await EJSRenderer(property);
        write(join(__dirname, 'tmp/homepage/rendered.html'), rendered);
        write(saveTo, rendered);
        console.log('saved', saveTo);
      });
    })
  )
  //.then((m) => m.run('generate tags', generateIndex(getChunkOf('tag'))))
  .then((m) => m.run('npm install', installNpm))
  .catch((e) => {
    console.error(e);
  });

/*

measure
  //.run('generate homepage', generateIndex, 'homepage')
  //.then(() => measure.run('generate all archive', generateIndex, 'all'))
  //.then(() => measure.run('generate archive page 1', generateIndex, 1))
  .run('generate tags', generateIndex, getChunkOf)
  .then((c) => c.run('npm install public directory', installNpm));*/

function installNpm() {
  console.log('spawning on', post_generated_dir);
  return spawner.promise(
    { cwd: post_generated_dir, stdio: 'inherit' },
    'npm',
    'install'
  );
}
