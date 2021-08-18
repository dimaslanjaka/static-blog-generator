const serveStatic = require("serve-static"),
  bodyParser = require("body-parser"),
  path = require("path");
const fs = require("hexo-fs");

hexo.extend.filter.register("server_middleware", function (app) {
  const staticRoutes = path.join(__dirname, "/../../../scripts/www");
  console.log(staticRoutes, fs.existsSync(staticRoutes));

  // Main routes
  app.use(hexo.config.root + "backend/", serveStatic(staticRoutes));
  app.use(hexo.config.root + "backend/api/", bodyParser.json({ limit: "50mb" }));

  app.use(function (req, res, next) {
    res.setHeader("X-Powered-By", "Hexo L3n4r0x");
    next();
  });
});
