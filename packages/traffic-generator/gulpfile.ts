import gulp from "gulp";
import { exec } from "child_process";

// copy non ts files
gulp.task("copy-non-ts", function () {
  return gulp
    .src(["./src/**/*.*", "!./src/**/*.{ts,json}"])
    .pipe(gulp.dest("./dist/traffic-generator/src"));
});

// delete dist and compile typescript
gulp.task("tsc", function (cb) {
  exec("tsc", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task("watch", function () {
  return gulp.watch(["./src/**/*"], gulp.series("tsc", "copy-non-ts"));
});

gulp.task("default", gulp.series("tsc", "copy-non-ts"));
