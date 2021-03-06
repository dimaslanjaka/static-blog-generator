import { join } from 'upath';
import color from '../../../node/color';
import { write } from '../../../node/filemanager';
import { getChunkOf } from './getChunkOf';

(async () => {
  const tagname = 'dummy';
  const saveFolder = join(__dirname, 'tmp/tags');

  const test = getChunkOf('tag');
  write(join(saveFolder, 'all.json'), test);
  console.log(
    color['Vivid Violet']('test result'),
    typeof test == 'string' && Object.keys(test).length > 0
  );

  const test2 = getChunkOf('tag', tagname);
  console.log(
    color['Vivid Violet']('test2 result'),
    typeof test2 == 'string' && Object.keys(test2).length > 0
  );
  write(join(saveFolder, `${tagname}.json`), test2);
})();
