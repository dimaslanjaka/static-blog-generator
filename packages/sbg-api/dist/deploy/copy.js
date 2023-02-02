"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployCopy = void 0;
var gulp_1 = __importDefault(require("gulp"));
var upath_1 = __importDefault(require("upath"));
/**
 * copy generated site to deployment directory
 * @param opt
 * @param ignore
 */
function deployCopy(opt, ignore) {
    if (ignore === void 0) { ignore = []; }
    var cwd = opt.cwd || process.cwd();
    return gulp_1.default
        .src([upath_1.default.join(cwd, opt.config.public_dir, '**/*')], { cwd: cwd, ignore: ignore || [] })
        .pipe(gulp_1.default.dest(upath_1.default.join(cwd, '.deploy_' + opt.config.deploy.type)));
}
exports.deployCopy = deployCopy;
//# sourceMappingURL=copy.js.map