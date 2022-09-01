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
    var configDeploy, e1_1, e2_1, hasSubmodule;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // create deploy folder
                if (!(0, fs_1.existsSync)(deployDir))
                    (0, filemanager_1.mkdirSync)(deployDir);
                configDeploy = _config_1.default.deploy;
                if (typeof configDeploy !== 'object' ||
                    configDeploy === null ||
                    'repo' in configDeploy === false) {
                    throw new Error('incorrect deploy config');
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
                _a.sent();
                _a.label = 2;
            case 2:
                if (!('name' in configDeploy || 'username' in configDeploy)) return [3 /*break*/, 4];
                console.log(logname, 'user name found, setting up...');
                return [4 /*yield*/, git('config', 'user.name', configDeploy['name'] || configDeploy['username'])];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!('email' in configDeploy)) return [3 /*break*/, 6];
                console.log(logname, 'user email found, setting up...');
                return [4 /*yield*/, git('config', 'user.email', configDeploy['email'])];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                if (!('gc' in configDeploy &&
                    configDeploy['gc'] &&
                    (0, fs_1.existsSync)((0, filemanager_1.join)(deployDir, '.git')))) return [3 /*break*/, 8];
                return [4 /*yield*/, git('gc', '--aggressive', '--prune')];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                _a.trys.push([8, 10, , 15]);
                return [4 /*yield*/, git('remote', 'add', 'origin', configDeploy['repo'])];
            case 9:
                _a.sent();
                return [3 /*break*/, 15];
            case 10:
                e1_1 = _a.sent();
                _a.label = 11;
            case 11:
                _a.trys.push([11, 13, , 14]);
                return [4 /*yield*/, git('remote', 'set-url', 'origin', configDeploy['repo'])];
            case 12:
                _a.sent();
                return [3 /*break*/, 14];
            case 13:
                e2_1 = _a.sent();
                if (e1_1)
                    console.log('error add origin', e1_1);
                if (e2_1)
                    console.log('error set-url origin', e2_1);
                return [3 /*break*/, 14];
            case 14: return [3 /*break*/, 15];
            case 15: 
            // fetch all
            return [4 /*yield*/, git('fetch', '--all')];
            case 16:
                // fetch all
                _a.sent();
                // setup merge on pull strategy
                return [4 /*yield*/, git('config', 'pull.rebase', 'false')];
            case 17:
                // setup merge on pull strategy
                _a.sent();
                // reset latest origin https://stackoverflow.com/a/8888015/6404439
                return [4 /*yield*/, git('reset', '--hard', 'origin/' + configDeploy['branch'])];
            case 18:
                // reset latest origin https://stackoverflow.com/a/8888015/6404439
                _a.sent();
                // checkout origin branch
                return [4 /*yield*/, git('checkout', '-f', configDeploy['branch'])];
            case 19:
                // checkout origin branch
                _a.sent();
                // pull origin
                return [4 /*yield*/, git('pull', 'origin', configDeploy['branch'])];
            case 20:
                // pull origin
                _a.sent();
                hasSubmodule = (0, fs_1.existsSync)((0, filemanager_1.join)(deployDir, '.gitmodules'));
                if (!hasSubmodule) return [3 /*break*/, 22];
                return [4 /*yield*/, git('submodule', 'update', '-i', '-r')];
            case 21:
                _a.sent();
                _a.label = 22;
            case 22: return [2 /*return*/, copyGenerated().on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
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