"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeVersion = void 0;
const construct_1 = __importDefault(require("./construct"));
//https://www.npmjs.com/package/node-json-db
exports.getNodeVersion = parseInt(process.version.toLowerCase().replace('v', ''));
exports.default = construct_1.default;
