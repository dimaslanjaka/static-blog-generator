#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs"));
var _config_1 = require("../types/_config");
var argv = (0, yargs_1.default)(process.argv.slice(2)).argv;
var tasks = argv['_'];
console.log((0, _config_1.getConfig)().verbose, (0, _config_1.getConfig)().generator.cache);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2JnLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2Jpbi9zYmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsZ0RBQTBCO0FBQzFCLDRDQUE2QztBQUU3QyxJQUFNLElBQUksR0FBRyxJQUFBLGVBQUssRUFBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUMvQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFBLG1CQUFTLEdBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBQSxtQkFBUyxHQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDIn0=