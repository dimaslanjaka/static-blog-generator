"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
        while (_) try {
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
exports.gulp = void 0;
var fs = __importStar(require("fs-extra"));
var gulp_1 = __importDefault(require("gulp"));
exports.gulp = gulp_1.default;
var path_1 = require("path");
require("./src");
var crawling_1 = __importDefault(require("./src/crawling"));
var git_1 = __importStar(require("./src/node/git"));
(0, crawling_1.default)();
exports.default = gulp_1.default;
// deploy to https://github.com/dimaslanjaka/static-blog-generator.git#compiler-jekyll
gulp_1.default.task('sbg:docs', function () { return __awaiter(void 0, void 0, void 0, function () {
    var dest, repo, branch, spawnOpt, gitInitialized;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dest = (0, path_1.join)(__dirname, '.deploy_docs');
                repo = 'https://github.com/dimaslanjaka/static-blog-generator.git';
                branch = 'compiler-jekyll';
                spawnOpt = {
                    cwd: dest,
                    stdio: 'inherit',
                    shell: true
                };
                //fs.rmSync(join(dest, '.git'), { recursive: true });
                if (!fs.existsSync(dest))
                    fs.mkdirSync(dest);
                gitInitialized = fs.existsSync((0, path_1.join)(dest, '.git'));
                if (!gitInitialized) {
                    (0, git_1.default)(spawnOpt, 'init').then(function () {
                        (0, git_1.default)(spawnOpt, 'remote', 'add', 'origin', repo);
                    });
                }
                else {
                    (0, git_1.default)(spawnOpt, 'remote', 'set-url', 'origin', repo);
                }
                return [4 /*yield*/, (0, git_1.default)(spawnOpt, 'config', 'user.email', 'dimaslanjaka@gmail.com')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, git_1.default)(spawnOpt, 'config', 'user.name', 'dimaslanjaka')];
            case 2:
                _a.sent();
                if (!gitInitialized) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, git_1.default)({ cwd: dest }, 'reset', '--hard', 'origin/' + branch)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, (0, git_1.default)(spawnOpt, 'fetch', 'origin')];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, git_1.default)({ cwd: dest }, 'checkout', branch)];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, git_1.default)(spawnOpt, 'pull')];
            case 7:
                _a.sent();
                gulp_1.default.src((0, path_1.join)(__dirname, 'readme.md')).pipe(gulp_1.default.dest(dest));
                gulp_1.default
                    .src([(0, path_1.join)(__dirname, 'src', '**/*.md'), '!**/tmp'])
                    .pipe(gulp_1.default.dest((0, path_1.join)(dest, 'usages')))
                    .on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var latestCommit, msg;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, git_1.default)({ cwd: dest }, 'add', '.')];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, git_1.default)({ cwd: dest }, 'add', '-A')];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, git_1.getLatestCommitHash)(__dirname)];
                            case 3:
                                latestCommit = _a.sent();
                                msg = "update page from ".concat(latestCommit);
                                return [4 /*yield*/, (0, git_1.default)({ cwd: dest }, 'commit', '-m', msg)];
                            case 4:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VscGZpbGUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJndWxwZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUErQjtBQUMvQiw4Q0FBd0I7QUFNZixlQU5GLGNBQUksQ0FNRTtBQUxiLDZCQUE0QjtBQUM1QixpQkFBZTtBQUNmLDREQUFzQztBQUN0QyxvREFBMEQ7QUFDMUQsSUFBQSxrQkFBUSxHQUFFLENBQUM7QUFFWCxrQkFBZSxjQUFJLENBQUM7QUFFcEIsc0ZBQXNGO0FBQ3RGLGNBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFOzs7OztnQkFDZCxJQUFJLEdBQUcsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLEdBQUcsMkRBQTJELENBQUM7Z0JBQ25FLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQztnQkFDM0IsUUFBUSxHQUE4QjtvQkFDMUMsR0FBRyxFQUFFLElBQUk7b0JBQ1QsS0FBSyxFQUFFLFNBQVM7b0JBQ2hCLEtBQUssRUFBRSxJQUFJO2lCQUNaLENBQUM7Z0JBQ0YscURBQXFEO2dCQUNyRCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7b0JBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkMsY0FBYyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBQSxXQUFJLEVBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxjQUFjLEVBQUU7b0JBQ25CLElBQUEsYUFBRyxFQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQ3pCLElBQUEsYUFBRyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFB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