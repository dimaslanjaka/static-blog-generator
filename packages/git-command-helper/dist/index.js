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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ext = void 0;
const git_1 = __importStar(require("./git"));
const git_info_1 = __importStar(require("./git-info"));
const spawn_1 = require("./spawn");
const submodule_1 = __importDefault(require("./submodule"));
exports.ext = {
    spawn: spawn_1.spawn,
    spawnAsync: spawn_1.spawnAsync,
    spawnSilent: spawn_1.spawnSilent,
    gitCommandHelper: git_1.gitCommandHelper,
    gitHelper: git_1.gitHelper,
    setupGit: git_1.setupGit,
    GithubInfo: git_info_1.default,
    getGithubBranches: git_info_1.getGithubBranches,
    getGithubCurrentBranch: git_info_1.getGithubCurrentBranch,
    getGithubRemote: git_info_1.getGithubRemote,
    getGithubRepoUrl: git_info_1.getGithubRepoUrl,
    getGithubRootDir: git_info_1.getGithubRootDir,
    gitSubmodule: submodule_1.default
};
exports.default = git_1.default;
