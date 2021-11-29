"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const path_1 = __importDefault(require("path"));
const fm = __importStar(require("../../../../../hexo-seo/src/fm"));
require("../../../../../hexo-seo/packages/js-prototypes/src/Number");
const fs_1 = require("fs");
class DBConstructor {
    /**
     * Database File Constructor
     * @param folder folder to save entire databases
     */
    constructor(folder) {
        this.folder = folder;
    }
    /**
     * check if data key on table exists
     * @param key
     * @returns
     */
    exists(key) {
        return (0, fs_1.existsSync)(this.locationfile(key));
    }
    /**
     * add data to table
     * @param key
     * @param value
     */
    push(key, value) {
        let content;
        content = typeof value + ':' + Buffer.from(value.toString()).toString('base64');
        if (Array.isArray(value) || typeof value == 'object') {
            content = typeof value + ':' + Buffer.from(JSON.stringify(value)).toString('base64');
        }
        else if (typeof value == 'number') {
            if (isInt(value)) {
                content = 'number:' + Buffer.from(value.toString()).toString('base64');
            }
            else if (isFloat(value)) {
                content = 'float:' + Buffer.from(value.toString()).toString('base64');
            }
        }
        fm.writeFile(this.locationfile(key), content);
    }
    /**
     * get table database by key
     * @param key key table
     * @param fallback fallback value if not exists
     * @returns
     * @example
     * const nonExists = db.exists('/data-not-exists', 'default value');
     * console.log(nonExists); // default value
     */
    get(key, fallback) {
        const ada = this.exists(key);
        if (!ada) {
            if (fallback)
                return fallback;
            return null;
        }
        const content = fm.readFile(this.locationfile(key)).toString().split(':');
        const value = Buffer.from(content[1], 'base64').toString('ascii');
        switch (content[0]) {
            case 'object' || 'array':
                return JSON.parse(value);
            case 'float':
                return parseFloat(value);
            case 'number':
                return parseInt(value);
            default:
                return value;
        }
    }
    locationfile(key) {
        return path_1.default.join(this.folder, key);
    }
}
exports.default = DBConstructor;
