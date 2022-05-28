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
exports.gulpInlineStyle = exports.removeInlineStyle = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var fs_1 = require("fs");
var color_1 = __importDefault(require("../../../node/color"));
var filemanager_1 = require("../../../node/filemanager");
var jsdom_1 = __importDefault(require("../../../node/jsdom"));
var parsePost_1 = __importStar(require("../../../parser/post/parsePost"));
var _config_1 = require("../../../types/_config");
/**
 * remove inline style html string
 * @param str
 * @param single_element true=single html (div, etc), false=full <html></html>
 * @returns
 */
function removeInlineStyle(str, single_element) {
    if (single_element === void 0) { single_element = true; }
    var dom = new jsdom_1.default();
    var doc = dom.parse(str);
    Array.from(doc.querySelectorAll('*[style]')).forEach(function (el) {
        el.removeAttribute('style');
    });
    if (single_element) {
        return dom.body().innerHTML;
    }
    else {
        return dom.serialize();
    }
}
exports.removeInlineStyle = removeInlineStyle;
/**
 * remove all blogger inline style html from posts
 * @returns
 */
function gulpInlineStyle() {
    return __awaiter(this, void 0, void 0, function () {
        var src;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, filemanager_1.globSrc)('**/*.md', { cwd: _config_1.post_public_dir })
                        .map(function (item) { return (0, filemanager_1.join)(_config_1.post_public_dir, item); })
                        .filter(fs_1.existsSync)];
                case 1:
                    src = _a.sent();
                    console.log("".concat(color_1.default.Beaver('[copy][remove-inline-style]'), " cwd=").concat(color_1.default.Mahogany(_config_1.post_public_dir), " found=").concat(color_1.default.Magenta(src.length), " post(s)"));
                    return [2 /*return*/, bluebird_1.default.all(src)
                            .map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = { path: item };
                                        return [4 /*yield*/, (0, parsePost_1.default)(item)];
                                    case 1: return [2 /*return*/, (_a.parsed = _b.sent(), _a)];
                                }
                            });
                        }); })
                            .filter(function (obj) {
                            return typeof obj.parsed == 'object' &&
                                typeof obj.parsed.body == 'string' &&
                                obj.parsed.body.length > 0;
                        })
                            .each(function (obj) {
                            var parsed = obj.parsed;
                            if (parsed.body.includes('<div dir="ltr" style="text-align: left;" trbidi="on">')) {
                                parsed.body = removeInlineStyle(parsed.body, true);
                                //console.log(obj.path);
                                (0, filemanager_1.write)(obj.path, (0, parsePost_1.buildPost)(parsed));
                            }
                        })];
            }
        });
    });
}
exports.gulpInlineStyle = gulpInlineStyle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3ZlLWlubGluZS1zdHlsZS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ndWxwL3Rhc2tzL2NvcHkvcmVtb3ZlLWlubGluZS1zdHlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUFnQztBQUNoQyx5QkFBZ0M7QUFDaEMsOERBQXdDO0FBQ3hDLHlEQUFpRTtBQUNqRSw4REFBdUM7QUFDdkMsMEVBQXNFO0FBQ3RFLGtEQUF5RDtBQUV6RDs7Ozs7R0FLRztBQUNILFNBQWdCLGlCQUFpQixDQUFDLEdBQVcsRUFBRSxjQUFxQjtJQUFyQiwrQkFBQSxFQUFBLHFCQUFxQjtJQUNsRSxJQUFNLEdBQUcsR0FBRyxJQUFJLGVBQUksRUFBRSxDQUFDO0lBQ3ZCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFFO1FBQ3RELEVBQUUsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLGNBQWMsRUFBRTtRQUNsQixPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUM7S0FDN0I7U0FBTTtRQUNMLE9BQU8sR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBQ3hCO0FBQ0gsQ0FBQztBQVhELDhDQVdDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBc0IsZUFBZTs7Ozs7O3dCQUN2QixxQkFBTSxJQUFBLHFCQUFPLEVBQUMsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLHlCQUFlLEVBQUUsQ0FBQzt5QkFDM0QsR0FBRyxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBQSxrQkFBSSxFQUFDLHlCQUFlLEVBQUUsSUFBSSxDQUFDLEVBQTNCLENBQTJCLENBQUM7eUJBQzFDLE1BQU0sQ0FBQyxlQUFVLENBQUMsRUFBQTs7b0JBRmYsR0FBRyxHQUFHLFNBRVM7b0JBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQ1QsVUFBRyxlQUFLLENBQUMsTUFBTSxDQUFDLDZCQUE2QixDQUFDLGtCQUFRLGVBQUssQ0FBQyxRQUFRLENBQ2xFLHlCQUFlLENBQ2hCLG9CQUFVLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFVLENBQy9DLENBQUM7b0JBQ0Ysc0JBQU8sa0JBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDOzZCQUNyQixHQUFHLENBQUMsVUFBTyxJQUFJOzs7OzsrQ0FDTCxJQUFJLEVBQUUsSUFBSTt3Q0FBVSxxQkFBTSxJQUFBLG1CQUFTLEVBQUMsSUFBSSxDQUFDLEVBQUE7NENBQWxELHVCQUFxQixTQUFNLEdBQUUsU0FBcUIsT0FBRzs7OzZCQUN0RCxDQUFDOzZCQUNELE1BQU0sQ0FDTCxVQUFDLEdBQUc7NEJBQ0YsT0FBQSxPQUFPLEdBQUcsQ0FBQyxNQUFNLElBQUksUUFBUTtnQ0FDN0IsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxRQUFRO2dDQUNsQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQzt3QkFGMUIsQ0FFMEIsQ0FDN0I7NkJBQ0EsSUFBSSxDQUFDLFVBQUMsR0FBRzs0QkFDUixJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDOzRCQUMxQixJQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUNsQix1REFBdUQsQ0FDeEQsRUFDRDtnQ0FDQSxNQUFNLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0NBQ25ELHdCQUF3QjtnQ0FDeEIsSUFBQSxtQkFBSyxFQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBQSxxQkFBUyxFQUFNLE1BQU0sQ0FBQyxDQUFDLENBQUM7NkJBQ3pDO3dCQUNILENBQUMsQ0FBQyxFQUFDOzs7O0NBQ047QUEvQkQsMENBK0JDIn0=