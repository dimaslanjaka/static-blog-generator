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
var bluebird_1 = __importDefault(require("bluebird"));
var fs = __importStar(require("fs-extra"));
var gulp_1 = __importDefault(require("gulp"));
exports.gulp = gulp_1.default;
var path_1 = require("path");
require("./src");
var src_1 = require("./src");
var crawling_1 = __importDefault(require("./src/crawling"));
var filemanager_1 = require("./src/node/filemanager");
var git_1 = __importDefault(require("./src/node/git"));
var _config_1 = __importDefault(require("./src/types/_config"));
(0, crawling_1.default)();
exports.default = gulp_1.default;
// deploy to https://github.com/dimaslanjaka/static-blog-generator.git#compiler-jekyll
gulp_1.default.task('sbg:docs', function (done) { return __awaiter(void 0, void 0, void 0, function () {
    var dest, repo, branch, spawnOpt, gitInitialized, destParse, parsed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dest = (0, path_1.join)(__dirname, 'public');
                repo = 'https://github.com/dimaslanjaka/static-blog-generator.git';
                branch = 'gh-pages';
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
                // reset commit as latest origin branch
                return [4 /*yield*/, (0, git_1.default)({ cwd: dest }, 'reset', '--hard', 'origin/' + branch)];
            case 3:
                // reset commit as latest origin branch
                _a.sent();
                _a.label = 4;
            case 4: 
            // fetch origin
            return [4 /*yield*/, (0, git_1.default)({ cwd: dest }, 'fetch', 'origin')];
            case 5:
                // fetch origin
                _a.sent();
                // checkout origin branch
                return [4 /*yield*/, (0, git_1.default)({ cwd: dest }, 'checkout', branch)];
            case 6:
                // checkout origin branch
                _a.sent();
                // setup merge on pull strategy
                return [4 /*yield*/, (0, git_1.default)({ cwd: dest }, 'config', 'pull.rebase', 'false')];
            case 7:
                // setup merge on pull strategy
                _a.sent();
                // pulling
                return [4 /*yield*/, (0, git_1.default)({ cwd: dest }, 'pull', 'origin', branch)];
            case 8:
                // pulling
                _a.sent();
                destParse = (0, path_1.join)(__dirname, _config_1.default.source_dir, '_posts');
                return [4 /*yield*/, (0, src_1.parsePost)((0, path_1.join)(__dirname, 'readme.md'), "\n---\ntitle: Readme Usages\nwebtitle: Static Blog Generator\ndate: 2022-06-10\nupdated: 2022-06-10\ncategory: ['guide']\ntags: ['guide']\n---\n\n\n    " + (0, filemanager_1.read)((0, path_1.join)(__dirname, 'readme.md')).toString(), { cache: false })];
            case 9:
                parsed = _a.sent();
                return [4 /*yield*/, (0, filemanager_1.write)((0, path_1.join)(destParse, 'index.md'), (0, src_1.buildPost)(parsed))];
            case 10:
                _a.sent();
                return [4 /*yield*/, bluebird_1.default.all((0, filemanager_1.globSrc)('**/*.md', {
                        cwd: (0, path_1.join)(__dirname, 'src'),
                        ignore: ['**/tmp/**'],
                        use: 'minimatch'
                    }))
                        .map(function (file) {
                        return {
                            parse: (0, src_1.parsePost)(file, (0, filemanager_1.read)(file).toString(), { cache: false }),
                            source: file,
                            build: null
                        };
                    })
                        .map(function (post) {
                        post.build = (0, src_1.buildPost)(post.parse);
                        return post;
                    })
                        .each(function (post) {
                        (0, filemanager_1.write)((0, path_1.join)(destParse, post.source), post.build).then(console.log);
                    })];
            case 11:
                _a.sent();
                return [2 /*return*/, done()];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VscGZpbGUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJndWxwZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUFnQztBQUNoQywyQ0FBK0I7QUFDL0IsOENBQXdCO0FBU2YsZUFURixjQUFJLENBU0U7QUFSYiw2QkFBNEI7QUFDNUIsaUJBQWU7QUFDZiw2QkFBNkM7QUFDN0MsNERBQXNDO0FBQ3RDLHNEQUE4RDtBQUM5RCx1REFBaUM7QUFDakMsZ0VBQXlDO0FBQ3pDLElBQUEsa0JBQVEsR0FBRSxDQUFDO0FBRVgsa0JBQWUsY0FBSSxDQUFDO0FBRXBCLHNGQUFzRjtBQUN0RixjQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFPLElBQUk7Ozs7O2dCQUN6QixJQUFJLEdBQUcsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLEdBQUcsMkRBQTJELENBQUM7Z0JBQ25FLE1BQU0sR0FBRyxVQUFVLENBQUM7Z0JBQ3BCLFFBQVEsR0FBOEI7b0JBQzFDLEdBQUcsRUFBRSxJQUFJO29CQUNULEtBQUssRUFBRSxTQUFTO29CQUNoQixLQUFLLEVBQUUsSUFBSTtpQkFDWixDQUFDO2dCQUNGLHFEQUFxRDtnQkFDckQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO29CQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLGNBQWMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUEsV0FBSSxFQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxJQUFJLENBQUMsY0FBYyxFQUFFO29CQUNuQixJQUFBLGFBQUcsRUFBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFD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