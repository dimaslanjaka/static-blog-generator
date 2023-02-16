"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyDir = void 0;
var minimatch_1 = __importDefault(require("minimatch"));
var readDir_1 = __importDefault(require("./readDir"));
/**
 * empty dir with filters
 * @param dir
 * @param param1
 */
function emptyDir(dir, _a) {
    var ignore = _a.ignore;
    (0, readDir_1.default)(dir, function (err, fileList) {
        if (err)
            throw err;
        // const filterFn = (pattern: string) => minimatch.filter(pattern, { matchBase: true });
        var filter = fileList.filter(function (file) {
            for (var i = 0; i < ignore.length; i++) {
                var pattern = ignore[i];
                if (typeof pattern === 'string') {
                    var match = (0, minimatch_1.default)(file, pattern, { matchBase: true, dot: true });
                    // console.log(file.replace(dir, ''), pattern, match);
                    // filter file if matched
                    if (match)
                        return false;
                }
                else {
                    // filter file if matched
                    if (pattern.test(file))
                        return false;
                }
            }
            return true;
        });
        return filter;
    });
}
exports.emptyDir = emptyDir;
//const _ex = path.join(__dirname, '../..');
//emptyDir(_ex, { ignore: ['**/config/**'] });
//# sourceMappingURL=emptyDir.js.map