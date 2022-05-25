import color from '../../node/color';
import { write } from '../../node/filemanager';
import { tmp } from '../../types/_config';
import { generateTags } from './generate-tags';

(async () => {
  const test = await generateTags();
  if (test) write(tmp('tags/index.html'), test);
  console.log(
    color['Vivid Violet']('test result'),
    typeof test == 'string' && test.length > 0
  );

  const test1 = await generateTags('dummy', 4);
  if (test1) write(tmp('tags/dummy-4.html'), test1);
  console.log(
    color['Vivid Violet']('test1 result'),
    typeof test1 == 'string' && test1.length > 0
  );

  const test2 = await generateTags('dummy');
  if (test2) write(tmp('tags/dummy.html'), test2);
  console.log(
    color['Vivid Violet']('test2 result'),
    typeof test2 == 'string' && test2.length > 0
  );
})();
