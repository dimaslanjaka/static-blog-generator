import { join } from 'upath';
import { fnWrap } from '../../parser/utility';
import { post_source_dir } from '../../types/_config';
import { processEJSMarkdownBody } from './processEJSMarkdownBody';

fnWrap(async () => {
  const sourcePath = join(post_source_dir, 'with-ejs-function-in-body.md');
  processEJSMarkdownBody(sourcePath);
});
