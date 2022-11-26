import { join } from 'path';
import { autoSeo } from '../src/gulp.seo';
import { renderHtmlToSource } from './utils';

const publicDIR = join(__dirname, 'public');
renderHtmlToSource().once('end', function () {
  autoSeo(publicDIR);
});
