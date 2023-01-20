#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
yargs_1.default
    .scriptName('sbg')
    .usage('usage: sbg <command>')
    .command('$0', 'the default command', () => { }, () => {
    yargs_1.default.showHelp();
});
//# sourceMappingURL=cli.js.map