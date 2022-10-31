"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const upath_1 = require("upath");
const utils_1 = require("./gulp/utils");
const color_1 = tslib_1.__importDefault(require("./node/color"));
const sanitize_filename_1 = tslib_1.__importDefault(require("./node/sanitize-filename"));
const utils_2 = require("./node/utils");
const _config_1 = require("./types/_config");
const string_1 = require("./utils/string");
function post_assets_fixer(target, options, sourcePath) {
    var _a;
    const logname = color_1.default['Teal Blue']('[PAF]');
    /**
     * source file if variable `text` is file
     */
    let originalFile = target;
    const isFile = (0, fs_1.existsSync)(target) && (0, fs_1.statSync)(target).isFile();
    if (isFile) {
        target = String((0, fs_1.readFileSync)(target, 'utf-8'));
        if (options.sourceFile)
            originalFile = options.sourceFile;
    }
    const publicFile = isFile
        ? (0, upath_1.toUnix)((0, upath_1.normalize)(originalFile))
        : (0, upath_1.toUnix)((0, upath_1.normalize)(options.sourceFile));
    if (!publicFile)
        return sourcePath;
    // replace extended title from source
    sourcePath = sourcePath.replace(/['"](.*)['"]/gim, '').trim();
    // return base64 image
    if (sourcePath.startsWith('data:image'))
        return sourcePath;
    if (sourcePath.startsWith('//'))
        sourcePath = 'http:' + sourcePath;
    if (sourcePath.includes('%20'))
        sourcePath = decodeURIComponent(sourcePath);
    if (!(0, utils_1.isValidHttpUrl)(sourcePath) && !sourcePath.startsWith('/')) {
        let result = null;
        /** search from same directory */
        const f1 = (0, upath_1.join)((0, upath_1.dirname)(publicFile), sourcePath);
        /** search from parent directory */
        const f2 = (0, upath_1.join)((0, upath_1.dirname)((0, upath_1.dirname)(publicFile)), sourcePath);
        /** search from root directory */
        const f3 = (0, upath_1.join)(process.cwd(), sourcePath);
        const f4 = (0, upath_1.join)(_config_1.post_generated_dir, sourcePath);
        [f1, f2, f3, f4].forEach((src) => {
            if (result !== null)
                return;
            if ((0, fs_1.existsSync)(src) && !result)
                result = src;
        });
        if (result === null) {
            const log = (0, upath_1.join)(__dirname, '../tmp/errors/post-asset-folder/' +
                (0, sanitize_filename_1.default)((0, upath_1.basename)(sourcePath).trim(), '-') +
                '.log');
            if (!(0, fs_1.existsSync)((0, upath_1.dirname)(log)))
                (0, fs_1.mkdirSync)((0, upath_1.dirname)(log), { recursive: true });
            (0, fs_1.writeFileSync)(log, JSON.stringify({ str: sourcePath, f1, f2, f3, f4 }, null, 2));
            console.log(logname, color_1.default.redBright('[fail]'), {
                str: sourcePath,
                log
            });
        }
        else {
            result = (0, utils_2.replaceArr)(result, [(0, upath_1.toUnix)(process.cwd()), 'source/', '_posts', 'src-posts'], '/');
            result = encodeURI((((_a = options.config) === null || _a === void 0 ? void 0 : _a.root) || '') + result);
            result = (0, string_1.removeDoubleSlashes)(result);
            if (options.config['verbose'])
                console.log(logname, '[success]', result);
            return result;
        }
    }
    return sourcePath;
}
exports.default = post_assets_fixer;
//# sourceMappingURL=post_assets_fixer.js.map