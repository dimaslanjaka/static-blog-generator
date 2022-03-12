const browserSync = require("browser-sync").create();
const path = require("path");
const files = [path.join(__dirname, "docs/*")];
console.log(files);
browserSync.init(files, {
  server: {
    baseDir: "docs",
    serveStaticOptions: {
      extensions: ["html"],
    },
  },
  port: 4000,
});
