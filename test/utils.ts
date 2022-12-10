import fm from 'front-matter';
import gulp from 'gulp';
import * as hpp from 'hexo-post-parser';
import through2 from 'through2';
import { join, toUnix } from 'upath';

process.cwd = () => toUnix(__dirname);

// stay here
import '../src/gulp.post';
import '../src/gulp.safelink';
// stay here

const publicDIR = join(__dirname, 'public');
const postDIR = join(__dirname, 'source/_posts');
const deployDIR = join(__dirname, '.deploy_git');

export function renderHtmlToSource() {
  return gulp
    .src('**/*.md', { cwd: postDIR })
    .pipe(
      through2.obj(function (file, _enc, next) {
        if (file.isNull()) return next();
        if (file.isBuffer()) {
          const md = file.contents.toString('utf-8');
          const parse = fm(md);
          const meta = parse.attributes as hpp.postMeta;
          const rendered = hpp.renderMarkdown(parse.body);

          file.contents = Buffer.from(`<html><head><title>${meta.title}</title></head><body>${rendered}</body></html>`);
          file.extname = '.html';
        }
        next(null, file);
      })
    )
    .pipe(gulp.dest(publicDIR));
}

export const copyToDeployDir = () => gulp.src(['*.html', '**/*.html'], { cwd: publicDIR }).pipe(gulp.dest(deployDIR));
