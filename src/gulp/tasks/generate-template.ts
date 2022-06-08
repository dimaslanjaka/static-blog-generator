import gulp from 'gulp';
import sass from 'node-sass';
import through2 from 'through2';
import { join, toUnix } from 'upath';
import color from '../../node/color';
import { replaceArr } from '../../node/string-utils';
import config, {
  cwd,
  post_generated_dir,
  theme_dir
} from '../../types/_config';

const logname = color.hex('#fcba03')('[render template]');

export const generateTemplate = () => {
  const src = join(theme_dir, 'source/**/**');
  console.log(
    logname + color.magentaBright('[template]'),
    'copy',
    src,
    '->',
    post_generated_dir
  );
  return gulp
    .src([src, '!**/.git*'], { cwd: process.cwd() })
    .pipe(
      through2.obj((file, enc, next) => {
        if (file.isNull()) {
          return next(null, file);
        }
        const path = toUnix(file.path);
        const ext = file.extname;

        if (ext == '.scss') {
          file.extname = '.css';
          const result = sass.renderSync({
            data: String(file.contents)
          });
          file.contents = result.css;
          console.log(
            color.pink('[sass]'),
            color.Red(replaceArr(path, [cwd(), /^\//], '')),
            '->',
            color.green(
              join(
                config.public_dir,
                replaceArr(path, [theme_dir + '/source', /^\//], '').replace(
                  /.scss$/,
                  '.css'
                )
              )
            )
          );
        }
        next(null, file);
      })
    )
    .pipe(gulp.dest(post_generated_dir));
  //.on('end', () => console.log(logname + chalk.magentaBright('[template]'), chalk.green('finish')));
};

gulp.task('generate:template', generateTemplate);
