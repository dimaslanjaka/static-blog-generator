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
var git_1 = __importStar(require("./src/node/git"));
exports.default = gulp_1.default;
// deploy to https://github.com/dimaslanjaka/static-blog-generator.git#gh-pages
gulp_1.default.task('sbg:docs', function () { return __awaiter(void 0, void 0, void 0, function () {
    var dest, repo, spawnOpt, gitInitialized;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dest = (0, path_1.join)(__dirname, '.deploy_docs');
                repo = 'https://github.com/dimaslanjaka/static-blog-generator.git';
                spawnOpt = {
                    cwd: dest,
                    stdio: 'inherit',
                    shell: true
                };
                //fs.rmSync(join(spawnOpt, '.git'), { recursive: true });
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
                return [4 /*yield*/, (0, git_1.default)(spawnOpt, 'fetch', '--all')];
            case 3:
                _a.sent();
                if (!gitInitialized) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, git_1.default)(spawnOpt, 'reset', '--hard', 'origin/gh-pages')];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [4 /*yield*/, (0, git_1.default)(spawnOpt, 'fetch', 'origin')];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, git_1.default)(spawnOpt, 'pull', repo, 'gh-pages:gh-pages')];
            case 7:
                _a.sent();
                gulp_1.default
                    .src([(0, path_1.join)(__dirname, 'src', '**/*.md'), 'readme.md'])
                    .pipe(gulp_1.default.dest(dest))
                    .on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var latestCommit;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, git_1.default)(spawnOpt, 'add', '-A')];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, git_1.getLatestCommitHash)()];
                            case 2:
                                latestCommit = _a.sent();
                                return [4 /*yield*/, (0, git_1.default)(spawnOpt, 'commit', '-m', "update page from ".concat(latestCommit))];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, (0, git_1.default)(spawnOpt, 'push', repo, 'gh-pages:gh-pages')];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VscGZpbGUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJndWxwZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUErQjtBQUMvQiw4Q0FBd0I7QUFJZixlQUpGLGNBQUksQ0FJRTtBQUhiLDZCQUE0QjtBQUM1QixpQkFBZTtBQUNmLG9EQUEwRDtBQUUxRCxrQkFBZSxjQUFJLENBQUM7QUFFcEIsK0VBQStFO0FBQy9FLGNBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFOzs7OztnQkFDZCxJQUFJLEdBQUcsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLEdBQUcsMkRBQTJELENBQUM7Z0JBQ25FLFFBQVEsR0FBOEI7b0JBQzFDLEdBQUcsRUFBRSxJQUFJO29CQUNULEtBQUssRUFBRSxTQUFTO29CQUNoQixLQUFLLEVBQUUsSUFBSTtpQkFDWixDQUFDO2dCQUNGLHlEQUF5RDtnQkFDekQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO29CQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLGNBQWMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUEsV0FBSSxFQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxJQUFJLENBQUMsY0FBYyxFQUFFO29CQUNuQixJQUFBLGFBQUcsRUFBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDO3dCQUN6QixJQUFBLGFBQUcsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ2pELENBQUMsQ0FBQyxDQUFDO2lCQUNKO3FCQUFNO29CQUNMLElBQUEsYUFBRyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDcEQ7Z0JBRUQscUJBQU0sSUFBQSxhQUFHLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsd0JBQXdCLENBQUMsRUFBQTs7Z0JBQXJFLFNBQXFFLENBQUM7Z0JBQ3RFLHFCQUFNLElBQUEsYUFBRyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLGNBQWMsQ0FBQyxFQUFBOztnQkFBMUQsU0FBMEQsQ0FBQztnQkFFM0QscUJBQU0sSUFBQSxhQUFHLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBQTs7Z0JBQXJDLFNBQXFDLENBQUM7cUJBQ2xDLGNBQWMsRUFBZCx3QkFBYztnQkFBRSxxQkFBTSxJQUFBLGFBQUcsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxFQUFBOztnQkFBekQsU0FBeUQsQ0FBQzs7b0JBQzlFLHFCQUFNLElBQUEsYUFBRyxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLEVBQUE7O2dCQUF0QyxTQUFzQyxDQUFDO2dCQUN2QyxxQkFBTSxJQUFBLGFBQUcsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxFQUFBOztnQkFBdEQsU0FBc0QsQ0FBQztnQkFDdkQsY0FBSTtxQkFDRCxHQUFHLENBQUMsQ0FBQyxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO3FCQUNyRCxJQUFJLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDckIsRUFBRSxDQUFDLEtBQUssRUFBRTs7OztvQ0FDVCxxQkFBTSxJQUFBLGFBQUcsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFBOztnQ0FBaEMsU0FBZ0MsQ0FBQztnQ0FDWixxQkFBTSxJQUFBLHlCQUFtQixHQUFFLEVBQUE7O2dDQUExQyxZQUFZLEdBQUcsU0FBMkI7Z0NBQ2hELHFCQUFNLElBQUEsYUFBRyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLDJCQUFvQixZQUFZLENBQUUsQ0FBQyxFQUFBOztnQ0FBdkUsU0FBdUUsQ0FBQztnQ0FDeEUscUJBQU0sSUFBQSxhQUFHLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsbUJBQW1CLENBQUMsRUFBQTs7Z0NBQXRELFNBQXNELENBQUM7Ozs7cUJBQ3hELENBQUMsQ0FBQzs7OztLQUNOLENBQUMsQ0FBQyJ9