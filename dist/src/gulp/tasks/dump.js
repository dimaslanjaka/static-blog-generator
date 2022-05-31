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
exports.dump = void 0;
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var upath_1 = require("upath");
var JSON_1 = require("../../node/JSON");
var object_utility_1 = require("../../node/object-utility");
var _config_1 = __importStar(require("../../types/_config"));
var dump = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        (0, fs_1.writeFile)((0, _config_1.tmp)('config.json'), (0, JSON_1.json_encode)((0, object_utility_1.sortedObject)(_config_1.default), 2), function (err) {
            if (!err)
                console.log('project config dump on', (0, _config_1.tmp)('config.json'));
        });
        (0, fs_1.writeFile)((0, _config_1.tmp)('theme_config.json'), (0, JSON_1.json_encode)(_config_1.theme_config, 2), function (err) {
            if (!err)
                console.log('theme config dump on', (0, _config_1.tmp)('theme_config.json'));
        });
        (0, fs_1.writeFile)((0, _config_1.tmp)('env.json'), (0, JSON_1.json_encode)(process.env, 2), function (err) {
            if (!err)
                console.log('theme config dump on', (0, _config_1.tmp)('theme_config.json'));
        });
        return [2 /*return*/];
    });
}); };
exports.dump = dump;
gulp_1.default.task('dump:posts', function (done) {
    require((0, upath_1.join)(__dirname, 'src/node/cache-post.test.ts'));
    done();
});
gulp_1.default.task('dump', exports.dump);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ndWxwL3Rhc2tzL2R1bXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5QkFBK0I7QUFDL0IsOENBQXdCO0FBQ3hCLCtCQUE2QjtBQUM3Qix3Q0FBOEM7QUFDOUMsNERBQXlEO0FBQ3pELDZEQUFnRTtBQUV6RCxJQUFNLElBQUksR0FBRzs7UUFDbEIsSUFBQSxjQUFTLEVBQUMsSUFBQSxhQUFHLEVBQUMsYUFBYSxDQUFDLEVBQUUsSUFBQSxrQkFBVyxFQUFDLElBQUEsNkJBQVksRUFBQyxpQkFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBQyxHQUFHO1lBQ3RFLElBQUksQ0FBQyxHQUFHO2dCQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsSUFBQSxhQUFHLEVBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUN0RSxDQUFDLENBQUMsQ0FBQztRQUNILElBQUEsY0FBUyxFQUFDLElBQUEsYUFBRyxFQUFDLG1CQUFtQixDQUFDLEVBQUUsSUFBQSxrQkFBVyxFQUFDLHNCQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBQyxHQUFHO1lBQ3BFLElBQUksQ0FBQyxHQUFHO2dCQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsSUFBQSxhQUFHLEVBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1FBQzFFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBQSxjQUFTLEVBQUMsSUFBQSxhQUFHLEVBQUMsVUFBVSxDQUFDLEVBQUUsSUFBQSxrQkFBVyxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBQyxHQUFHO1lBQzFELElBQUksQ0FBQyxHQUFHO2dCQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsSUFBQSxhQUFHLEVBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1FBQzFFLENBQUMsQ0FBQyxDQUFDOzs7S0FDSixDQUFDO0FBWFcsUUFBQSxJQUFJLFFBV2Y7QUFFRixjQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxVQUFDLElBQUk7SUFDM0IsT0FBTyxDQUFDLElBQUEsWUFBSSxFQUFDLFNBQVMsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDLENBQUM7SUFDeEQsSUFBSSxFQUFFLENBQUM7QUFDVCxDQUFDLENBQUMsQ0FBQztBQUVILGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFlBQUksQ0FBQyxDQUFDIn0=