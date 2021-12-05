import gulp from "gulp";
import { exec } from "child_process";
import del from "del";

// copy non ts files
const copyNonTsFiles = function () {
  return gulp
    .src(["./src/**/*", "!./src/**/*.{ts}"])
    .pipe(gulp.src(["./src/**/*.d.ts"]))
    .pipe(gulp.dest("./dist/traffic-generator/src"));
};
gulp.task("copy-non-ts", copyNonTsFiles);

// delete dist and compile typescript
const tsc = function (cb?) {
  return exec("tsc", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (typeof cb === "function") cb(err);
  });
};

function clean(params) {
  return del("./dist");
}
gulp.task("tsc", tsc);
gulp.task("watch", function () {
  return gulp.watch(["./src/**/*"], gulp.series("tsc", "copy-non-ts"));
});

/*gulp.task("watch", function () {

  watcher.on("change", function (filePath, stats) {
    //console.log(path, stats);
    const isTs = memoize((filePath: string) => {
      return minimatch(filePath, "*.{ts,js,json}", { nocase: true, matchBase: true });
    });
    if (isTs(filePath)) {
      console.log("compiling typescript..");
      return tsc();
    } else {
      console.log("copying non-typescript file..");
      return copyNonTsFiles();
    }
  });
  return watcher;
*/
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
gulp.task("dev", gulp.series("tsc", "copy-non-ts"));
gulp.task("default", gulp.series(clean, "tsc", "copy-non-ts"));
