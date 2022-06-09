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

export default async function homepageTest() {
  try {
    const m = await measure.run('generate assets', generateAssets);
    await m.run('generate template', generateTemplate);
    await m.run('generate homepage', () => {
      const opt = Bluebird.all(getHomepageProperties())
        .map((archive) => modifyPost(archive, { merge: true, cache: false }))
        .filter(
          (archive_1) => archive_1 !== null && typeof archive_1 !== 'undefined'
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
    });
    return await m.run('npm install', installNpm);
  } catch (e) {
    console.error(e);
  }
}

function installNpm() {
  console.log('spawning on', post_generated_dir);
  return spawner.promise(
    { cwd: post_generated_dir, stdio: 'inherit' },
    'npm',
    'install'
  );
}
