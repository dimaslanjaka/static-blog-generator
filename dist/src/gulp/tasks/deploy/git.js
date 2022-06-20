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
    var configDeploy, initialized, hasSubmodule;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, fs_1.existsSync)(deployDir))
                    (0, filemanager_1.mkdirSync)(deployDir);
                configDeploy = _config_1.default.deploy;
                if (typeof configDeploy !== 'object' || configDeploy === null) {
                    console.log('incorrect deploy config');
                    return [2 /*return*/];
                }
                configDeploy['base'] = deployDir;
                initialized = (0, fs_1.existsSync)((0, filemanager_1.join)(deployDir, '.git'));
                if (!(0, fs_1.existsSync)(deployDir))
                    (0, filemanager_1.mkdirSync)(deployDir);
                if (!!initialized) return [3 /*break*/, 7];
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
            case 5: return [4 /*yield*/, git('remote', 'add', 'origin', configDeploy['repo'])];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                if (!initialized) return [3 /*break*/, 9];
                return [4 /*yield*/, git('remote', 'set-url', 'origin', configDeploy['repo'])];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9: 
            // fetch all
            return [4 /*yield*/, git('fetch', '--all')];
            case 10:
                // fetch all
                _a.sent();
                // setup merge on pull strategy
                return [4 /*yield*/, git('config', 'pull.rebase', 'false')];
            case 11:
                // setup merge on pull strategy
                _a.sent();
                // reset latest origin https://stackoverflow.com/a/8888015/6404439
                return [4 /*yield*/, git('reset', '--hard', 'origin/' + configDeploy['branch'])];
            case 12:
                // reset latest origin https://stackoverflow.com/a/8888015/6404439
                _a.sent();
                // checkout origin branch
                return [4 /*yield*/, git('checkout', '-f', configDeploy['branch'])];
            case 13:
                // checkout origin branch
                _a.sent();
                // pull origin
                return [4 /*yield*/, git('pull', 'origin', configDeploy['branch'])];
            case 14:
                // pull origin
                _a.sent();
                hasSubmodule = (0, fs_1.existsSync)((0, filemanager_1.join)(deployDir, '.gitmodules'));
                if (!hasSubmodule) return [3 /*break*/, 16];
                return [4 /*yield*/, git('submodule', 'update', '-i', '-r')];
            case 15:
                _a.sent();
                _a.label = 16;
            case 16: return [2 /*return*/, copyGenerated().on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                                if (!('branch' in configDeploy)) return [3 /*break*/, 9];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvZGVwbG95L2dpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUEwQjtBQUMxQiwrQ0FBc0M7QUFDdEMseUJBQWdDO0FBQ2hDLDhDQUF3QjtBQUV4Qix5REFBcUU7QUFDckUseUNBQXdEO0FBQ3hELHVEQUEyRDtBQUMzRCxnRUFBMEU7QUFDMUUsK0NBQThDO0FBRTlDLElBQU0sU0FBUyxHQUFHLElBQUEscUJBQU8sRUFBQyxJQUFBLGtCQUFJLEVBQUMsY0FBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7QUFFckQ7Ozs7R0FJRztBQUNILFNBQVMsR0FBRztJQUFDLGNBQWlCO1NBQWpCLFVBQWlCLEVBQWpCLHFCQUFpQixFQUFqQixJQUFpQjtRQUFqQix5QkFBaUI7O0lBQzVCLE9BQU8sSUFBSSxPQUFPLENBQ2hCLFVBQ0UsT0FBd0UsRUFDeEUsTUFBcUQ7UUFFckQsSUFBTSxNQUFNLEdBQUcsSUFBQSxxQkFBSyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDaEMsR0FBRyxFQUFFLFNBQVM7WUFDZCxLQUFLLEVBQUUsU0FBUztTQUNqQixDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUk7WUFDL0IseUNBQXlDO1lBQ3pDLHdCQUF3QjtZQUN4QixPQUFPLE9BQU8sQ0FBQztnQkFDYixJQUFJLEVBQUUsSUFBSTtnQkFDVixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQzdCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzthQUM5QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxFQUFFLENB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