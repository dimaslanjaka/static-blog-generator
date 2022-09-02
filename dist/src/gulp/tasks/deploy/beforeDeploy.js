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
exports.beforeDeploy = void 0;
var fs = __importStar(require("fs"));
var upath = __importStar(require("upath"));
var color_1 = __importDefault(require("../../../node/color"));
var git_1 = require("../../../node/git");
var spawner_1 = __importDefault(require("../../../node/spawner"));
var date_1 = require("../../../renderer/helpers/date");
var logname = color_1.default['Burnt Sienna']('[deploy][before-push]');
/**
 * process before push
 * @param cwd current working directory
 */
function beforeDeploy(cwd) {
    return __awaiter(this, void 0, void 0, function () {
        var pkg, submoduleFile, submodule, i, sm, msg, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    pkg = upath.join(cwd, 'package.json');
                    if (!fs.existsSync(pkg)) return [3 /*break*/, 2];
                    console.log(logname, 'package.json found, installing...');
                    return [4 /*yield*/, spawner_1.default.promise({
                            cwd: cwd
                        }, 'npm', 'install', '--production', '--omit=dev')];
                case 1: return [2 /*return*/, _c.sent()];
                case 2:
                    submoduleFile = upath.join(cwd, '.gitmodules');
                    console.log(logname, submoduleFile, ' found ', fs.existsSync(submoduleFile));
                    if (!fs.existsSync(submoduleFile)) return [3 /*break*/, 10];
                    submodule = (0, git_1.extractSubmodule)(submoduleFile);
                    if (!submodule) return [3 /*break*/, 10];
                    i = 0;
                    _c.label = 3;
                case 3:
                    if (!(i < submodule.data.length)) return [3 /*break*/, 10];
                    sm = submodule.data[i];
                    if (!fs.existsSync(sm.fullpath)) return [3 /*break*/, 9];
                    console.log(logname, 'adding submodule files...');
                    return [4 /*yield*/, spawner_1.default.promise({
                            cwd: sm.fullpath
                        }, 'git', 'add', '-A')];
                case 4:
                    _c.sent();
                    console.log(logname, 'comiting submodule...');
                    msg = 'Update site';
                    if (!fs.existsSync(upath.join(process.cwd(), '.git'))) return [3 /*break*/, 6];
                    _a = msg;
                    _b = ' ';
                    return [4 /*yield*/, (0, git_1.getLatestCommitHash)()];
                case 5:
                    msg = _a + (_b + (_c.sent()));
                    _c.label = 6;
                case 6:
                    msg += '\ndate: ' + (0, date_1.modMoment)().format();
                    return [4 /*yield*/, spawner_1.default.promise({
                            cwd: sm.fullpath
                        }, 'git', 'commit', '-m', msg)];
                case 7:
                    _c.sent();
                    console.log(logname, 'pushing submodule...');
                    return [4 /*yield*/, spawner_1.default.promise({
                            cwd: sm.fullpath
                        }, 'git', 'push')];
                case 8:
                    _c.sent();
                    _c.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 3];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.beforeDeploy = beforeDeploy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVmb3JlRGVwbG95LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvZGVwbG95L2JlZm9yZURlcGxveS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUF5QjtBQUN6QiwyQ0FBK0I7QUFDL0IsOERBQXdDO0FBQ3hDLHlDQUEwRTtBQUMxRSxrRUFBNEM7QUFDNUMsdURBQTJEO0FBRTNELElBQU0sT0FBTyxHQUFHLGVBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBRS9EOzs7R0FHRztBQUNILFNBQXNCLFlBQVksQ0FBQyxHQUFXOzs7Ozs7b0JBQ3RDLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQzt5QkFDeEMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBbEIsd0JBQWtCO29CQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO29CQUNuRCxxQkFBTSxpQkFBTyxDQUFDLE9BQU8sQ0FDMUI7NEJBQ0UsR0FBRyxLQUFBO3lCQUNKLEVBQ0QsS0FBSyxFQUNMLFNBQVMsRUFDVCxjQUFjLEVBQ2QsWUFBWSxDQUNiLEVBQUE7d0JBUkQsc0JBQU8sU0FRTixFQUFDOztvQkFHRSxhQUFhLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO3lCQUN6RSxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxFQUE1Qix5QkFBNEI7b0JBQ3hCLFNBQVMsR0FBRyxJQUFBLHNCQUFnQixFQUFDLGFBQWEsQ0FBQyxDQUFDO3lCQUM5QyxTQUFTLEVBQVQseUJBQVM7b0JBQ0YsQ0FBQyxHQUFHLENBQUM7Ozt5QkFBRSxDQUFBLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTtvQkFDakMsRUFBRSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3pCLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUExQix3QkFBMEI7b0JBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLDJCQUEyQixDQUFDLENBQUM7b0JBQ2xELHFCQUFNLGlCQUFPLENBQUMsT0FBTyxDQUNuQjs0QkFDRSxHQUFHLEVBQUUsRUFBRSxDQUFDLFFBQVE7eUJBQ2pCLEVBQ0QsS0FBSyxFQUNMLEtBQUssRUFDTCxJQUFJLENBQ0wsRUFBQTs7b0JBUEQsU0FPQyxDQUFDO29CQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLHVCQUF1QixDQUFDLENBQUM7b0JBQzFDLEdBQUcsR0FBRyxhQUFhLENBQUM7eUJBQ3BCLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBaEQsd0JBQWdEO29CQUNsRCxLQUFBLEdBQUcsQ0FBQTtvQkFBSSxLQUFBLEdBQUcsQ0FBQTtvQkFBSSxxQkFBTSxJQUFBLHlCQUFtQixHQUFFLEVBQUE7O29CQUF6QyxHQUFHLEdBQUgsTUFBTyxLQUFNLENBQUMsU0FBMkIsQ0FBQyxDQUFBLENBQUM7OztvQkFFN0MsR0FBRyxJQUFJLFVBQVUsR0FBRyxJQUFBLGdCQUFTLEdBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDekMscUJBQU0saUJBQU8sQ0FBQyxPQUFPLENBQ25COzRCQUNFLEdBQUcsRUFBRSxFQUFFLENBQUMsUUFBUTt5QkFDakIsRUFDRCxLQUFLLEVBQ0wsUUFBUSxFQUNSLElBQUksRUFDSixHQUFHLENBQ0osRUFBQTs7b0JBUkQsU0FRQyxDQUFDO29CQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLHNCQUFzQixDQUFDLENBQUM7b0JBQzdDLHFCQUFNLGlCQUFPLENBQUMsT0FBTyxDQUNuQjs0QkFDRSxHQUFHLEVBQUUsRUFBRSxDQUFDLFFBQVE7eUJBQ2pCLEVBQ0QsS0FBSyxFQUNMLE1BQU0sQ0FDUCxFQUFBOztvQkFORCxTQU1DLENBQUM7OztvQkFsQ3FDLENBQUMsRUFBRSxDQUFBOzs7Ozs7Q0F1Q25EO0FBM0RELG9DQTJEQyJ9