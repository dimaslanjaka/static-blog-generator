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
var color_1 = __importDefault(require("../../../node/color"));
var filemanager_1 = require("../../../node/filemanager");
var git_1 = require("../../../node/git");
var date_1 = require("../../../renderer/helpers/date");
var _config_1 = __importStar(require("../../../types/_config"));
var beforeDeploy_1 = require("./beforeDeploy");
var deployDir = (0, filemanager_1.resolve)((0, filemanager_1.join)(_config_1.root, '.deploy_git'));
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
        .src(['**/**', '!**/.git*'], { cwd: _config_1.post_generated_dir, dot: true })
        .pipe(gulp_1.default.dest(deployDir));
};
/**
 * GitHub Deployer
 * @param done
 * @returns
 */
var deployerGit = function (done) { return __awaiter(void 0, void 0, void 0, function () {
    var configDeploy, _a, hasSubmodule;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(0, fs_1.existsSync)(deployDir))
                    (0, filemanager_1.mkdirSync)(deployDir);
                configDeploy = _config_1.default.deploy;
                if (typeof configDeploy !== 'object' || configDeploy === null) {
                    console.log('incorrect deploy config');
                    return [2 /*return*/];
                }
                if ('branch' in configDeploy === false) {
                    console.log(color_1.default.redBright('cannot push without branch'));
                    return [2 /*return*/];
                }
                configDeploy['base'] = deployDir;
                if (!(0, fs_1.existsSync)(deployDir))
                    (0, filemanager_1.mkdirSync)(deployDir);
                if (!!(0, fs_1.existsSync)((0, filemanager_1.join)(deployDir, '.git'))) return [3 /*break*/, 2];
                console.log(logname, 'init new git with current configuration', configDeploy);
                return [4 /*yield*/, git('init')];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2:
                if (!configDeploy['name']) return [3 /*break*/, 4];
                return [4 /*yield*/, git('config', 'user.name', configDeploy['name'])];
            case 3:
                _b.sent();
                return [3 /*break*/, 6];
            case 4:
                if (!configDeploy['username']) return [3 /*break*/, 6];
                return [4 /*yield*/, git('config', 'user.name', configDeploy['username'])];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                if (!configDeploy['email']) return [3 /*break*/, 8];
                return [4 /*yield*/, git('config', 'user.email', configDeploy['email'])];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8:
                _b.trys.push([8, 10, , 12]);
                return [4 /*yield*/, git('remote', 'add', 'origin', configDeploy['repo'])];
            case 9:
                _b.sent();
                return [3 /*break*/, 12];
            case 10:
                _a = _b.sent();
                return [4 /*yield*/, git('remote', 'set-url', 'origin', configDeploy['repo'])];
            case 11:
                _b.sent();
                return [3 /*break*/, 12];
            case 12: 
            // fetch all
            return [4 /*yield*/, git('fetch', '--all')];
            case 13:
                // fetch all
                _b.sent();
                // setup merge on pull strategy
                return [4 /*yield*/, git('config', 'pull.rebase', 'false')];
            case 14:
                // setup merge on pull strategy
                _b.sent();
                // reset latest origin https://stackoverflow.com/a/8888015/6404439
                return [4 /*yield*/, git('reset', '--hard', 'origin/' + configDeploy['branch'])];
            case 15:
                // reset latest origin https://stackoverflow.com/a/8888015/6404439
                _b.sent();
                // checkout origin branch
                return [4 /*yield*/, git('checkout', '-f', configDeploy['branch'])];
            case 16:
                // checkout origin branch
                _b.sent();
                // pull origin
                return [4 /*yield*/, git('pull', 'origin', configDeploy['branch'])];
            case 17:
                // pull origin
                _b.sent();
                hasSubmodule = (0, fs_1.existsSync)((0, filemanager_1.join)(deployDir, '.gitmodules'));
                if (!hasSubmodule) return [3 /*break*/, 19];
                return [4 /*yield*/, git('submodule', 'update', '-i', '-r')];
            case 18:
                _b.sent();
                _b.label = 19;
            case 19: return [2 /*return*/, copyGenerated().on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var msg, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, (0, beforeDeploy_1.beforeDeploy)(_config_1.post_generated_dir)];
                            case 1:
                                _c.sent();
                                return [4 /*yield*/, git('add', '-A')];
                            case 2:
                                _c.sent();
                                msg = 'Update site';
                                if (!(0, fs_1.existsSync)((0, filemanager_1.join)(process.cwd(), '.git'))) return [3 /*break*/, 4];
                                _a = msg;
                                _b = ' ';
                                return [4 /*yield*/, (0, git_1.getLatestCommitHash)()];
                            case 3:
                                msg = _a + (_b + (_c.sent()));
                                _c.label = 4;
                            case 4:
                                msg += '\ndate: ' + (0, date_1.modMoment)().format();
                                return [4 /*yield*/, git('commit', '-m', msg)];
                            case 5:
                                _c.sent();
                                if (!(Object.hasOwnProperty.call(configDeploy, 'force') &&
                                    configDeploy['force'] === true)) return [3 /*break*/, 7];
                                return [4 /*yield*/, git('push', '-u', configDeploy['repo'], 'origin', configDeploy['branch'], '--force')];
                            case 6:
                                _c.sent();
                                return [3 /*break*/, 9];
                            case 7: return [4 /*yield*/, git('push', '--set-upstream', 'origin', configDeploy['branch'])];
                            case 8:
                                _c.sent();
                                _c.label = 9;
                            case 9:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvZGVwbG95L2dpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUEwQjtBQUMxQiwrQ0FBc0M7QUFDdEMseUJBQWdDO0FBQ2hDLDhDQUF3QjtBQUV4Qiw4REFBd0M7QUFDeEMseURBQXFFO0FBQ3JFLHlDQUF3RDtBQUN4RCx1REFBMkQ7QUFDM0QsZ0VBQTBFO0FBQzFFLCtDQUE4QztBQUU5QyxJQUFNLFNBQVMsR0FBRyxJQUFBLHFCQUFPLEVBQUMsSUFBQSxrQkFBSSxFQUFDLGNBQUksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO0FBRXJEOzs7O0dBSUc7QUFDSCxTQUFTLEdBQUc7SUFBQyxjQUFpQjtTQUFqQixVQUFpQixFQUFqQixxQkFBaUIsRUFBakIsSUFBaUI7UUFBakIseUJBQWlCOztJQUM1QixPQUFPLElBQUksT0FBTyxDQUNoQixVQUNFLE9BQXdFLEVBQ3hFLE1BQXFEO1FBRXJELElBQU0sTUFBTSxHQUFHLElBQUEscUJBQUssRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO1lBQ2hDLEdBQUcsRUFBRSxTQUFTO1lBQ2QsS0FBSyxFQUFFLFNBQVM7U0FDakIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJO1lBQy9CLHlDQUF5QztZQUN6Qyx3QkFBd0I7WUFDeEIsT0FBTyxPQUFPLENBQUM7Z0JBQ2IsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUM3QixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDOUIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFN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