"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sbg_utility_1 = require("sbg-utility");
//const DEV_SITE_ROOT = path.join(__dirname, '../../../test'); // 'D:/Repositories/static-blog-generator/test';
// set default config
var serverConfig = new sbg_utility_1.createConfig('sbg-server', {
    //root: fs.existsSync(DEV_SITE_ROOT) ? DEV_SITE_ROOT : process.cwd(),
    root: process.cwd(),
    port: 4000
});
exports.default = serverConfig;
//# sourceMappingURL=config.js.map