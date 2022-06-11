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
var bluebird_1 = __importDefault(require("bluebird"));
var upath_1 = require("upath");
var measure_timing_1 = __importDefault(require("../../../node/benchmark/measure-timing"));
var filemanager_1 = require("../../../node/filemanager");
var spawner_1 = __importDefault(require("../../../node/spawner"));
var modifyPost_1 = __importDefault(require("../../../parser/post/modifyPost"));
var EJSRenderer_1 = require("../../../renderer/ejs/EJSRenderer");
var _config_1 = __importStar(require("../../../types/_config"));
var generate_assets_1 = require("../generate-assets");
var generate_template_1 = require("../generate-template");
var getArchiveProperties_1 = require("./getArchiveProperties");
var measure = new measure_timing_1.default();
function homepageTest() {
    return __awaiter(this, void 0, void 0, function () {
        var m, e_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, measure.run('generate assets', generate_assets_1.generateAssets)];
                case 1:
                    m = _a.sent();
                    return [4 /*yield*/, m.run('generate template', generate_template_1.generateTemplate)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, m.run('generate homepage', function () {
                            var opt = bluebird_1.default.all((0, getArchiveProperties_1.getHomepageProperties)())
                                .map(function (archive) { return (0, modifyPost_1.default)(archive, { merge: true, cache: false }); })
                                .filter(function (archive_1) { return archive_1 !== null && typeof archive_1 !== 'undefined'; });
                            (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/homepage/rendered-opt.log'), opt);
                            bluebird_1.default.all(opt).each(function (property) { return __awaiter(_this, void 0, void 0, function () {
                                var pagePath, saveTo, rendered;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            // fix title
                                            if (property.page_now === 0) {
                                                property.title = null;
                                                property.metadata.title = null;
                                            }
                                            pagePath = property.page_now > 0
                                                ? _config_1.default.archive_dir + '/page/' + property.page_now + '/index.html'
                                                : 'index.html';
                                            saveTo = (0, upath_1.join)(_config_1.post_generated_dir, pagePath);
                                            return [4 /*yield*/, (0, EJSRenderer_1.EJSRenderer)(property)];
                                        case 1:
                                            rendered = _a.sent();
                                            (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/homepage/rendered.html'), rendered);
                                            (0, filemanager_1.write)(saveTo, rendered);
                                            console.log('saved', saveTo);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, m.run('npm install', installNpm)];
                case 4: return [2 /*return*/, _a.sent()];
                case 5:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.default = homepageTest;
function installNpm() {
    console.log('spawning on', _config_1.post_generated_dir);
    return spawner_1.default.promise({ cwd: _config_1.post_generated_dir, stdio: 'inherit' }, 'npm', 'install');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZXBhZ2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ndWxwL3Rhc2tzL2dlbmVyYXRlL2hvbWVwYWdlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUFnQztBQUNoQywrQkFBNkI7QUFDN0IsMEZBQWlFO0FBQ2pFLHlEQUFrRDtBQUNsRCxrRUFBNEM7QUFDNUMsK0VBQXlEO0FBQ3pELGlFQUFnRTtBQUNoRSxnRUFBb0U7QUFDcEUsc0RBQW9EO0FBQ3BELDBEQUF3RDtBQUN4RCwrREFBK0Q7QUFFL0QsSUFBTSxPQUFPLEdBQUcsSUFBSSx3QkFBVyxFQUFFLENBQUM7QUFFbEMsU0FBOEIsWUFBWTs7Ozs7Ozs7b0JBRTVCLHFCQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsZ0NBQWMsQ0FBQyxFQUFBOztvQkFBeEQsQ0FBQyxHQUFHLFNBQW9EO29CQUM5RCxxQkFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLG9DQUFnQixDQUFDLEVBQUE7O29CQUFsRCxTQUFrRCxDQUFDO29CQUNuRCxxQkFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFOzRCQUMvQixJQUFNLEdBQUcsR0FBRyxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFBLDRDQUFxQixHQUFFLENBQUM7aUNBQzlDLEdBQUcsQ0FBQyxVQUFDLE9BQU8sSUFBSyxPQUFBLElBQUEsb0JBQVUsRUFBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFsRCxDQUFrRCxDQUFDO2lDQUNwRSxNQUFNLENBQ0wsVUFBQyxTQUFTLElBQUssT0FBQSxTQUFTLEtBQUssSUFBSSxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsRUFBdEQsQ0FBc0QsQ0FDdEUsQ0FBQzs0QkFDSixJQUFBLG1CQUFLLEVBQUMsSUFBQSxZQUFJLEVBQUMsU0FBUyxFQUFFLCtCQUErQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7NEJBQzdELGtCQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFPLFFBQVE7Ozs7OzRDQUNwQyxZQUFZOzRDQUNaLElBQUksUUFBUSxDQUFDLFFBQVEsS0FBSyxDQUFDLEVBQUU7Z0RBQzNCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dEQUN0QixRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7NkNBQ2hDOzRDQUNLLFFBQVEsR0FDWixRQUFRLENBQUMsUUFBUSxHQUFHLENBQUM7Z0RBQ25CLENBQUMsQ0FBQyxpQkFBTSxDQUFDLFdBQVcsR0FBRyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsR0FBRyxhQUFhO2dEQUNuRSxDQUFDLENBQUMsWUFBWSxDQUFDOzRDQUNiLE1BQU0sR0FBRyxJQUFBLFlBQUksRUFBQyw0QkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQzs0Q0FDakMscUJBQU0sSUFBQSx5QkFBVyxFQUFDLFFBQVEsQ0FBQyxFQUFBOzs0Q0FBdEMsUUFBUSxHQUFHLFNBQTJCOzRDQUM1QyxJQUFBLG1CQUFLLEVBQUMsSUFBQSxZQUFJLEVBQUMsU0FBUyxFQUFFLDRCQUE0QixDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7NENBQy9ELElBQUEsbUJBQUssRUFBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7NENBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDOzs7O2lDQUM5QixDQUFDLENBQUM7d0JBQ0wsQ0FBQyxDQUFDLEVBQUE7O29CQXZCRixTQXVCRSxDQUFDO29CQUNJLHFCQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxFQUFBO3dCQUE3QyxzQkFBTyxTQUFzQyxFQUFDOzs7b0JBRTlDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBQyxDQUFDLENBQUM7Ozs7OztDQUVwQjtBQWhDRCwrQkFnQ0M7QUFFRCxTQUFTLFVBQVU7SUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsNEJBQWtCLENBQUMsQ0FBQztJQUMvQyxPQUFPLGlCQUFPLENBQUMsT0FBTyxDQUNwQixFQUFFLEdBQUcsRUFBRSw0QkFBa0IsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQzdDLEtBQUssRUFDTCxTQUFTLENBQ1YsQ0FBQztBQUNKLENBQUMifQ==