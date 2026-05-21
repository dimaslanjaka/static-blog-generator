# API Documentation for src/gulp-utils/gulp-dom.ts

## gulpDom


gulp-dom

### Example

```ts
const gulp = require('gulp');
 gulp.task('html', function() {
     return gulp.src('./src/index.html')
         .pipe(gulpDom(function(){
             return this.querySelectorAll('body')[0].setAttribute('data-version', '1.0');
         }))
         .pipe(gulp.dest('./public/'));
 });
```

### Parameters

- `mutator`: `import("/home/runner/work/static-blog-generator/static-blog-generator/packages/sbg-utility/src/gulp-utils/gulp-dom").GulpDomCallback` — callback

### Returns

`import("stream").Transform`

