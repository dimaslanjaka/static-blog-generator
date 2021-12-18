import browserSync from "browser-sync";
import serveStatic from "serve-static";

browserSync.init({
  server: {
    baseDir: "./docs",
    middleware: [serveStatic("./docs", { extensions: ["html", "css", "js"] })],
  },
  port: 4000,
});
