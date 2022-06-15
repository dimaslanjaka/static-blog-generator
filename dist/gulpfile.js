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
var gulp_1 = __importDefault(require("gulp"));
exports.gulp = gulp_1.default;
var path_1 = require("path");
require("./src");
var src_1 = require("./src");
var crawling_1 = __importDefault(require("./src/crawling"));
var filemanager_1 = require("./src/node/filemanager");
var _config_1 = __importDefault(require("./src/types/_config"));
(0, crawling_1.default)();
exports.default = gulp_1.default;
// deploy to https://github.com/dimaslanjaka/static-blog-generator.git#compiler-jekyll
gulp_1.default.task('sbg:docs', function (done) { return __awaiter(void 0, void 0, void 0, function () {
    var destParse, parsed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                destParse = (0, path_1.join)(__dirname, _config_1.default.source_dir, '_posts');
                return [4 /*yield*/, (0, src_1.parsePost)((0, path_1.join)(__dirname, 'readme.md'), "\n---\ntitle: Readme Usages\nwebtitle: Static Blog Generator\ndate: 2022-06-10\nupdated: 2022-06-10\ncategory: ['guide']\ntags: ['guide']\n---\n\n\n    " + (0, filemanager_1.read)((0, path_1.join)(__dirname, 'readme.md')).toString(), { cache: false })];
            case 1:
                parsed = _a.sent();
                return [4 /*yield*/, (0, filemanager_1.write)((0, path_1.join)(destParse, 'index.md'), (0, src_1.buildPost)(parsed))];
            case 2:
                _a.sent();
                return [4 /*yield*/, bluebird_1.default.all((0, filemanager_1.globSrc)('**/*.md', {
                        cwd: (0, path_1.join)(__dirname, 'src'),
                        ignore: ['**/tmp/**'],
                        use: 'minimatch'
                    }))
                        .map(function (file) { return (0, path_1.join)(__dirname, 'src', file); })
                        .map(function (file) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, (0, src_1.parsePost)(file, null, {
                                            cache: false
                                        })];
                                case 1: return [2 /*return*/, (_a.parse = _b.sent(),
                                        _a.source = file,
                                        _a.build = null,
                                        _a)];
                            }
                        });
                    }); })
                        .map(function (post) {
                        post.build = (0, src_1.buildPost)(post.parse);
                        return post;
                    })
                        .each(function (post) {
                        var saveTo = (0, path_1.join)(destParse, post.source.replace((0, path_1.join)(__dirname, 'src'), ''));
                        console.log(saveTo);
                        if (post.build)
                            (0, filemanager_1.write)(saveTo, post.build).then(console.log);
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, done()];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VscGZpbGUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJndWxwZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBZ0M7QUFDaEMsOENBQXdCO0FBUWYsZUFSRixjQUFJLENBUUU7QUFQYiw2QkFBNEI7QUFDNUIsaUJBQWU7QUFDZiw2QkFBNkM7QUFDN0MsNERBQXNDO0FBQ3RDLHNEQUE4RDtBQUM5RCxnRUFBeUM7QUFDekMsSUFBQSxrQkFBUSxHQUFFLENBQUM7QUFFWCxrQkFBZSxjQUFJLENBQUM7QUFFcEIsc0ZBQXNGO0FBQ3RGLGNBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQU8sSUFBSTs7Ozs7Z0JBRXpCLFNBQVMsR0FBRyxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsaUJBQU0sQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ2hELHFCQUFNLElBQUEsZUFBUyxFQUM1QixJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLEVBQzVCLDBKQVNDLEdBQUcsSUFBQSxrQkFBSSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUNqRCxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FDakIsRUFBQTs7Z0JBYkssTUFBTSxHQUFHLFNBYWQ7Z0JBQ0QscUJBQU0sSUFBQSxtQkFBSyxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsRUFBRSxJQUFBLGVBQVMsRUFBQyxNQUFNLENBQUMsQ0FBQyxFQUFBOztnQkFBM0QsU0FBMkQsQ0FBQztnQkFDNUQscUJBQU0sa0JBQVEsQ0FBQyxHQUFHLENBQ2hCLElBQUEscUJBQU8sRUFBQyxTQUFTLEVBQUU7d0JBQ2pCLEdBQUcsRUFBRSxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO3dCQUMzQixNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUM7d0JBQ3JCLEdBQUcsRUFBRSxXQUFXO3FCQUNqQixDQUFDLENBQ0g7eUJBQ0UsR0FBRyxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQzt5QkFDM0MsR0FBRyxDQUFDLFVBQU8sSUFBSTs7Ozs7O29DQUVMLHFCQUFNLElBQUEsZUFBUyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUU7NENBQ2pDLEtBQUssRUFBRSxLQUFLO3lDQUNiLENBQUMsRUFBQTt3Q0FISix1QkFDRSxRQUFLLEdBQUUsU0FFTDt3Q0FDRixTQUFNLEdBQUUsSUFBSTt3Q0FDWixRQUFLLEdBQUUsSUFBSTs2Q0FDWDs7O3lCQUNILENBQUM7eUJBQ0QsR0FBRyxDQUFDLFVBQUMsSUFBSTt3QkFDUixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUEsZUFBUyxFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDbkMsT0FBTyxJQUFJLENBQUM7b0JBQ2QsQ0FBQyxDQUFDO3lCQUNELElBQUksQ0FBQyxVQUFDLElBQUk7d0JBQ1QsSUFBTSxNQUFNLEdBQUcsSUFBQSxXQUFJLEVBQ2pCLFNBQVMsRUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQ2hELENBQUM7d0JBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxJQUFJLENBQUMsS0FBSzs0QkFBRSxJQUFBLG1CQUFLLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUM5RCxDQUFDLENBQUMsRUFBQTs7Z0JBNUJKLFNBNEJJLENBQUM7Z0JBQ0wsc0JBQU8sSUFBSSxFQUFFLEVBQUM7OztLQW1CZixDQUFDLENBQUMifQ==