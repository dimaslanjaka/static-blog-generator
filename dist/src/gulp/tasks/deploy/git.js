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
exports.deployerGit = void 0;
var chalk_1 = __importDefault(require("chalk"));
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var filemanager_1 = require("../../../node/filemanager");
var git_1 = require("../../../node/git");
var date_1 = require("../../../renderer/ejs/helper/date");
var _config_1 = __importStar(require("../../../types/_config"));
var deployDir = (0, filemanager_1.resolve)((0, filemanager_1.join)(_config_1.root, '.deploy_git'));
if (!(0, fs_1.existsSync)(deployDir))
    (0, filemanager_1.mkdirSync)(deployDir);
var generatedDir = _config_1.post_generated_dir;
/**
 * git command
 * @param args
 * @returns
 */
function git() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new Promise(function (resolve, reject) {
        var summon = (0, child_process_1.spawn)('git', args, {
            cwd: deployDir,
            stdio: 'inherit'
        });
        summon.on('close', function (code) {
            // Should probably be 'exit', not 'close'
            // *** Process completed
            return resolve({
                code: code,
                stdout: String(summon.stdout),
                stderr: String(summon.stderr)
            });
        });
        summon.on('error', function (err) {
            // *** Process creation failed
            return reject({ args: args, err: err });
        });
    });
}
var logname = chalk_1.default.magentaBright('[deploy][git]');
var copyGenerated = function () {
    return gulp_1.default
        .src(['**/**', '!**/.git*'], { cwd: generatedDir, dot: true })
        .pipe(gulp_1.default.dest(deployDir));
};
/**
 * GitHub Deployer
 * @param done
 * @returns
 */
var deployerGit = function (done) { return __awaiter(void 0, void 0, void 0, function () {
    var configDeploy, init;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                configDeploy = _config_1.default.deploy;
                if (typeof configDeploy !== 'object' || configDeploy === null) {
                    console.log('incorrect deploy config');
                    return [2 /*return*/];
                }
                configDeploy['base'] = deployDir;
                init = false;
                if (!(0, fs_1.existsSync)(deployDir))
                    (0, filemanager_1.mkdirSync)(deployDir);
                if (!!(0, fs_1.existsSync)((0, filemanager_1.join)(deployDir, '.git'))) return [3 /*break*/, 5];
                init = true;
                console.log(logname, 'init new git with current configuration', configDeploy);
                return [4 /*yield*/, git('init')];
            case 1:
                _a.sent();
                if (!configDeploy['name']) return [3 /*break*/, 3];
                return [4 /*yield*/, git('config', 'user.name', configDeploy['name'])];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                if (!configDeploy['email']) return [3 /*break*/, 5];
                return [4 /*yield*/, git('config', 'user.email', configDeploy['email'])];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                if (!!init) return [3 /*break*/, 7];
                return [4 /*yield*/, git('gc')];
            case 6:
                _a.sent(); // compress git databases
                _a.label = 7;
            case 7: // compress git databases
            return [4 /*yield*/, git('remote', 'add', 'origin', configDeploy['repo'])];
            case 8:
                _a.sent();
                return [4 /*yield*/, git('remote', 'set-url', 'origin', configDeploy['repo'])];
            case 9:
                _a.sent();
                return [4 /*yield*/, git('fetch', '--all')];
            case 10:
                _a.sent();
                // setup merge on pull strategy
                return [4 /*yield*/, git('config', 'pull.rebase', 'false')];
            case 11:
                // setup merge on pull strategy
                _a.sent();
                // checkout origin branch
                return [4 /*yield*/, git('checkout', configDeploy['branch'])];
            case 12:
                // checkout origin branch
                _a.sent();
                // pull origin
                return [4 /*yield*/, git('pull', 'origin', configDeploy['branch'])];
            case 13:
                // pull origin
                _a.sent();
                return [2 /*return*/, copyGenerated().on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var msg, _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, git('add', '-A')];
                                case 1:
                                    _c.sent();
                                    msg = 'Update site';
                                    if (!(0, fs_1.existsSync)((0, filemanager_1.join)(process.cwd(), '.git'))) return [3 /*break*/, 3];
                                    _a = msg;
                                    _b = ' ';
                                    return [4 /*yield*/, (0, git_1.getLatestCommitHash)()];
                                case 2:
                                    msg = _a + (_b + (_c.sent()));
                                    _c.label = 3;
                                case 3:
                                    msg += '\ndate: ' + (0, date_1.modMoment)().format();
                                    return [4 /*yield*/, git('commit', '-m', msg)];
                                case 4:
                                    _c.sent();
                                    if (!(Object.hasOwnProperty.call(configDeploy, 'force') &&
                                        configDeploy['force'] === true)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, git('push', '-u', configDeploy['repo'], 'origin', configDeploy['branch'], '--force')];
                                case 5:
                                    _c.sent();
                                    return [3 /*break*/, 8];
                                case 6:
                                    if (!('branch' in configDeploy)) return [3 /*break*/, 8];
                                    return [4 /*yield*/, git('push', '--set-upstream', 'origin', configDeploy['branch'])];
                                case 7:
                                    _c.sent();
                                    _c.label = 8;
                                case 8:
                                    console.log(logname, 'deploy merged with origin successful');
                                    done();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
        }
    });
}); };
exports.deployerGit = deployerGit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvZGVwbG95L2dpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUEwQjtBQUMxQiwrQ0FBc0M7QUFDdEMseUJBQWdDO0FBQ2hDLDhDQUF3QjtBQUV4Qix5REFBcUU7QUFDckUseUNBQXdEO0FBQ3hELDBEQUE4RDtBQUM5RCxnRUFBMEU7QUFFMUUsSUFBTSxTQUFTLEdBQUcsSUFBQSxxQkFBTyxFQUFDLElBQUEsa0JBQUksRUFBQyxjQUFJLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztBQUNyRCxJQUFJLENBQUMsSUFBQSxlQUFVLEVBQUMsU0FBUyxDQUFDO0lBQUUsSUFBQSx1QkFBUyxFQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pELElBQU0sWUFBWSxHQUFHLDRCQUFrQixDQUFDO0FBQ3hDOzs7O0dBSUc7QUFDSCxTQUFTLEdBQUc7SUFBQyxjQUFpQjtTQUFqQixVQUFpQixFQUFqQixxQkFBaUIsRUFBakIsSUFBaUI7UUFBakIseUJBQWlCOztJQUM1QixPQUFPLElBQUksT0FBTyxDQUNoQixVQUNFLE9BQXdFLEVBQ3hFLE1BQXFEO1FBRXJELElBQU0sTUFBTSxHQUFHLElBQUEscUJBQUssRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO1lBQ2hDLEdBQUcsRUFBRSxTQUFTO1lBQ2QsS0FBSyxFQUFFLFNBQVM7U0FDakIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJO1lBQy9CLHlDQUF5QztZQUN6Qyx3QkFBd0I7WUFDeEIsT0FBTyxPQUFPLENBQUM7Z0JBQ2IsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUM3QixN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