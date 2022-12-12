"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cross_spawn_1 = __importDefault(require("cross-spawn"));
var gulp_1 = __importDefault(require("gulp"));
var through2_1 = __importDefault(require("through2"));
var upath_1 = require("upath");
var gulp_config_1 = __importDefault(require("./gulp.config"));
var string_1 = require("./utils/string");
/**
 * run all _*.standalone.js inside src-posts (_config_yml.post_dir)
 * @returns
 */
function standaloneRunner() {
    console.log('[standalone] Running scripts...');
    return gulp_1.default
        .src((0, upath_1.join)(gulp_config_1.default.cwd, '**/_*.standalone.js'), { cwd: gulp_config_1.default.cwd, ignore: ['**/tmp/**'] })
        .pipe(through2_1.default.obj(function (file, _enc, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, child;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log('='.repeat(10) + ' input ' + '='.repeat(10));
                        _b = (_a = console).log;
                        _c = "node ".concat;
                        return [4 /*yield*/, (0, string_1.replacePath)(file.path, gulp_config_1.default.cwd, '')];
                    case 1:
                        _b.apply(_a, [_c.apply("node ", [_d.sent()])]);
                        console.log('='.repeat(10) + ' ouput ' + '='.repeat(10));
                        child = (0, cross_spawn_1.default)('node', [file.path], { stdio: 'inherit' });
                        child.on('close', function () {
                            // drop file
                            next();
                        });
                        return [2 /*return*/];
                }
            });
        });
    }))
        .pipe(gulp_1.default.dest((0, upath_1.join)(gulp_config_1.default.cwd, 'tmp/standalone')))
        .once('end', function () {
        console.log('[standalone] stopped');
    });
}
gulp_1.default.task('post:standalone', standaloneRunner);
exports.default = standaloneRunner;
