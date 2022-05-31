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
var moment_1 = __importDefault(require("moment"));
var filemanager_1 = require("../../../node/filemanager");
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
                if (!configDeploy.name) return [3 /*break*/, 3];
                return [4 /*yield*/, git('config', 'user.name', configDeploy.name)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                if (!configDeploy.email) return [3 /*break*/, 5];
                return [4 /*yield*/, git('config', 'user.email', configDeploy.email)];
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
                return [4 /*yield*/, git('pull', 'origin', configDeploy['branch'])];
            case 11:
                _a.sent();
                return [2 /*return*/, copyGenerated().on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, git('add', '-A')];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, git('commit', '-m', 'Update site: ' + (0, moment_1.default)().format())];
                                case 2:
                                    _a.sent();
                                    if (!(Object.hasOwnProperty.call(configDeploy, 'force') &&
                                        configDeploy['force'] === true)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, git('push', '-u', configDeploy['repo'], 'origin', configDeploy['branch'], '--force')];
                                case 3:
                                    _a.sent();
                                    return [3 /*break*/, 6];
                                case 4:
                                    if (!('branch' in configDeploy)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, git('push', '--set-upstream', 'origin', configDeploy['branch'])];
                                case 5:
                                    _a.sent();
                                    _a.label = 6;
                                case 6:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvZGVwbG95L2dpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUEwQjtBQUMxQiwrQ0FBc0M7QUFDdEMseUJBQWdDO0FBQ2hDLDhDQUF3QjtBQUN4QixrREFBNEI7QUFFNUIseURBQXFFO0FBQ3JFLGdFQUEwRTtBQUUxRSxJQUFNLFNBQVMsR0FBRyxJQUFBLHFCQUFPLEVBQUMsSUFBQSxrQkFBSSxFQUFDLGNBQUksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO0FBQ3JELElBQUksQ0FBQyxJQUFBLGVBQVUsRUFBQyxTQUFTLENBQUM7SUFBRSxJQUFBLHVCQUFTLEVBQUMsU0FBUyxDQUFDLENBQUM7QUFDakQsSUFBTSxZQUFZLEdBQUcsNEJBQWtCLENBQUM7QUFDeEM7Ozs7R0FJRztBQUNILFNBQVMsR0FBRztJQUFDLGNBQWlCO1NBQWpCLFVBQWlCLEVBQWpCLHFCQUFpQixFQUFqQixJQUFpQjtRQUFqQix5QkFBaUI7O0lBQzVCLE9BQU8sSUFBSSxPQUFPLENBQ2hCLFVBQ0UsT0FBd0UsRUFDeEUsTUFBcUQ7UUFFckQsSUFBTSxNQUFNLEdBQUcsSUFBQSxxQkFBSyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDaEMsR0FBRyxFQUFFLFNBQVM7WUFDZCxLQUFLLEVBQUUsU0FBUztTQUNqQixDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUk7WUFDL0IseUNBQXlDO1lBQ3pDLHdCQUF3QjtZQUN4QixPQUFPLE9BQU8sQ0FBQztnQkFDYixJQUFJLEVBQUUsSUFBSTtnQkFDVixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQzdCLE1BQU0sRUFBRSxNQUFN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