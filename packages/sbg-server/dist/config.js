"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var sbg_utility_1 = require("sbg-utility");
var upath_1 = __importDefault(require("upath"));
var DEV_SITE_ROOT = upath_1.default.join(__dirname, '../../../test'); // 'D:/Repositories/static-blog-generator/test';
// set default config
var serverConfig = new sbg_utility_1.createConfig('sbg-server', {
    root: fs_extra_1.default.existsSync(DEV_SITE_ROOT) ? DEV_SITE_ROOT : process.cwd(),
    port: 4000
});
exports.default = serverConfig;
//# sourceMappingURL=config.js.map