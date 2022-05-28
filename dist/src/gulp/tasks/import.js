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
/* eslint-disable @typescript-eslint/no-unused-vars */
/* IMPORT FROM OTHER PLATFORMS */
var fast_xml_parser_1 = require("fast-xml-parser");
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var download_image_1 = __importDefault(require("../../curl/download-image"));
var filemanager_1 = require("../../node/filemanager");
var _config_1 = __importStar(require("../../types/_config"));
var homepage = new URL(_config_1.default.url);
gulp_1.default.task('import', function () { return __awaiter(void 0, void 0, void 0, function () {
    var platforms, files, i, file, XMLdata, parser, jObj, rss, channel, author, wpAuthor, icon, url, saveTo, posts, i_1, post;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                platforms = _config_1.default.import.platform;
                if (!Object.hasOwnProperty.call(platforms, 'wordpress')) return [3 /*break*/, 7];
                console.log('wordpress import found');
                files = platforms.wordpress;
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < files.length)) return [3 /*break*/, 7];
                file = (0, filemanager_1.join)(_config_1.default.root, 'import', files[i]);
                if (!(0, fs_1.existsSync)(file)) return [3 /*break*/, 6];
                XMLdata = (0, filemanager_1.read)(file).toString();
                parser = new fast_xml_parser_1.XMLParser();
                jObj = parser.parse(XMLdata);
                if (!(typeof jObj === 'object' && jObj.rss)) return [3 /*break*/, 4];
                rss = jObj.rss;
                if (!rss.channel) return [3 /*break*/, 4];
                channel = rss.channel;
                author = {};
                wpAuthor = channel['wp:author'];
                delete channel['wp:term'];
                delete channel['wp:tag'];
                delete channel['wp:category'];
                if (wpAuthor['wp:author_email'])
                    author.email = wpAuthor['wp:author_email'];
                if (wpAuthor['wp:author_display_name'])
                    author.name = wpAuthor['wp:author_display_name'];
                icon = void 0;
                if (!channel.image) return [3 /*break*/, 3];
                if (!channel.image.url) return [3 /*break*/, 3];
                url = new URL(channel.image.url);
                homepage.pathname = url.pathname;
                icon = homepage.toString();
                saveTo = (0, filemanager_1.join)(_config_1.default.root, _config_1.default.source_dir, url.pathname);
                //console.log('[import][wordpress] saving site image');
                return [4 /*yield*/, (0, download_image_1.default)(url.toString(), saveTo)];
            case 2:
                //console.log('[import][wordpress] saving site image');
                _a.sent();
                _a.label = 3;
            case 3:
                posts = void 0;
                if (channel.item) {
                    posts = channel.item;
                    for (i_1 = 0; i_1 < posts.length; i_1++) {
                        post = posts[i_1];
                        delete post['content:encoded'];
                        delete post['wp:postmeta'];
                        if (['page', 'post'].includes(post['wp:post_type']) &&
                            post['wp:status'] === 'publish') {
                            console.log(post.title, post.link);
                        }
                        else {
                            delete posts[i_1];
                        }
                    }
                }
                _a.label = 4;
            case 4: return [4 /*yield*/, (0, filemanager_1.write)((0, _config_1.tmp)('wp-all.json'), jObj)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 1];
            case 7: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvaW1wb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBc0Q7QUFDdEQsaUNBQWlDO0FBQ2pDLG1EQUE0QztBQUM1Qyx5QkFBZ0M7QUFDaEMsOENBQXdCO0FBQ3hCLDZFQUFzRDtBQUN0RCxzREFBMkQ7QUFDM0QsNkRBQWtEO0FBRWxELElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFckMsY0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Ozs7O2dCQUNaLFNBQVMsR0FBRyxpQkFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7cUJBQ3JDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsRUFBbEQsd0JBQWtEO2dCQUNwRCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBQ2hDLEtBQUssR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDO2dCQUNuQyxDQUFDLEdBQUcsQ0FBQzs7O3FCQUFFLENBQUEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUE7Z0JBQ3hCLElBQUksR0FBRyxJQUFBLGtCQUFJLEVBQUMsaUJBQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMvQyxJQUFBLGVBQVUsRUFBQyxJQUFJLENBQUMsRUFBaEIsd0JBQWdCO2dCQUNaLE9BQU8sR0FBRyxJQUFBLGtCQUFJLEVBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2hDLE1BQU0sR0FBRyxJQUFJLDJCQUFTLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQy9CLENBQUEsT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUEsRUFBcEMsd0JBQW9DO2dCQUNoQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztxQkFFakIsR0FBRyxDQUFDLE9BQU8sRUFBWCx3QkFBVztnQkFDUCxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztnQkFFdEIsTUFBTSxHQUFrQyxFQUFFLENBQUM7Z0JBQzNDLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3RDLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUMxQixPQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDekIsT0FBTyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQzlCLElBQUksUUFBUSxDQUFDLGlCQUFpQixDQUFDO29CQUM3QixNQUFNLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUM3QyxJQUFJLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQztvQkFDcEMsTUFBTSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFFL0MsSUFBSSxTQUFRLENBQUM7cUJBQ2IsT0FBTyxDQUFDLEtBQUssRUFBYix3QkFBYTtxQkFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBakIsd0JBQWlCO2dCQUNiLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QyxRQUFRLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7Z0JBQ2pDLElBQUksR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3JCLE1BQU0sR0FBRyxJQUFBLGtCQUFJLEVBQ2pCLGlCQUFNLENBQUMsSUFBSSxFQUNYLGlCQUFNLENBQUMsVUFBVSxFQUNqQixHQUFHLENBQUMsUUFBUSxDQUNiLENBQUM7Z0JBQ0YsdURBQXVEO2dCQUN2RCxxQkFBTSxJQUFBLHdCQUFhLEVBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sQ0FBQyxFQUFBOztnQkFEM0MsdURBQXVEO2dCQUN2RCxTQUEyQyxDQUFDOzs7Z0JBTTVDLEtBQUssU0FBVSxDQUFDO2dCQUNwQixJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7b0JBQ2hCLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO29CQUNyQixLQUFTLE1BQUksQ0FBQyxFQUFFLEdBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUMsRUFBRSxFQUFFO3dCQUMvQixJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUMsQ0FBQyxDQUFDO3dCQUN0QixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO3dCQUMvQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDM0IsSUFDRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDOzRCQUMvQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssU0FBUyxFQUMvQjs0QkFDQSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3lCQUNwQzs2QkFBTTs0QkFDTCxPQUFPLEtBQUssQ0FBQyxHQUFDLENBQUMsQ0FBQzt5QkFDakI7cUJBQ0Y7aUJBQ0Y7O29CQUdMLHFCQUFNLElBQUEsbUJBQUssRUFBQyxJQUFBLGFBQUcsRUFBQyxhQUFhLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBQTs7Z0JBQXJDLFNBQXFDLENBQUM7OztnQkEzRFIsQ0FBQyxFQUFFLENBQUE7Ozs7O0tBK0R4QyxDQUFDLENBQUMifQ==