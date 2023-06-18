"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployCopy = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var sbg_utility_1 = require("sbg-utility");
/**
 * copy generated site to deployment directory
 * @param opt
 * @param ignore
 */
function deployCopy(opt) {
    var config = opt.config;
    if (!config)
        config = (0, sbg_utility_1.getConfig)();
    return fs_extra_1.default.copy(opt.config.public_dir, config.deploy.deployDir, { overwrite: true });
}
exports.deployCopy = deployCopy;
//# sourceMappingURL=copy.js.map