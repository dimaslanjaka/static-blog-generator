import gulp from "gulp";
import { exec } from "child_process";
import del from "del";
import Promise from "bluebird";

// copy non ts files
const copyNonTsFiles = function () {
  return gulp
    .src(["./src/**/*", "./src/**/*.d.ts", "!./src/**/*.ts"])
    .pipe(gulp.dest("./dist/traffic-generator/src"));
};
gulp.task("copy-non-ts", copyNonTsFiles);
gulp.task("copy", copyNonTsFiles);

// delete dist and compile typescript
const tsc = function (cb?) {
  return exec("tsc", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (typeof cb === "function") cb(err);
  });
};

function clean(done) {
  return del("dist");
}

gulp.task("clean", clean);

gulp.task("tsc", tsc);
gulp.task("watch", function () {
  return gulp.watch(["./src/**/*"], gulp.series("tsc", "copy-non-ts"));
});

import proxyGrabber from "proxies-grabber";
function testProxy(done) {
  const grabber = new proxyGrabber();
  const proxies = grabber.get();
  return proxies.then((result) => {
    console.log(result);
    done();
  });
}

gulp.task("proxy", testProxy);
gulp.task("default", gulp.series("copy-non-ts", "tsc"));
gulp.task("build", gulp.series(clean, "copy-non-ts", "tsc"));

import obfuscator from "gulp-javascript-obfuscator";
function obfuscate(done: gulp.TaskFunctionCallback) {
  const obfuscateMain = () => {
    return gulp
      .src([
        "./dist/traffic-generator/src/*.js",
        "!./dist/traffic-generator/src/views"
      ])
      .pipe(
        obfuscator({
          target: "node",
          compact: true,
          identifierNamesGenerator: "mangled-shuffled"
        })
      )
      .pipe(gulp.dest("./dist/traffic-generator/src"));
  };
  const obfuscateRenderer = () => {
    return gulp
      .src(["./dist/traffic-generator/src/views/**/*.js"])
      .pipe(
        obfuscator({
          target: "browser",
          compact: true,
          identifierNamesGenerator: "mangled-shuffled"
        })
      )
      .pipe(gulp.dest("./dist/traffic-generator/src/views"));
  };
  return Promise.all([obfuscateRenderer]).lastly(done);
}
gulp.task("obfuscate", gulp.series("default", obfuscate));
