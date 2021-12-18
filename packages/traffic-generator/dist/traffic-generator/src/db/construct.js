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
const path_1 = __importDefault(require("path"));
const fm = __importStar(require("../../../hexo-seo/src/fm"));
require("../../../hexo-seo/packages/js-prototypes/src/Number");
const fs_1 = require("fs");
class DBConstructor {
    /**
     * Database File Constructor
     * @param folder folder to save entire databases
     */
    constructor(folder) {
        this.debug = false;
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
        content =
            typeof value + ":" + Buffer.from(value.toString()).toString("base64");
        if (Array.isArray(value)) {
            content =
                "array:" + Buffer.from(JSON.stringify(value)).toString("base64");
        }
        else if (typeof value == "object") {
            content =
                typeof value +
                    ":" +
                    Buffer.from(JSON.stringify(value)).toString("base64");
        }
        else if (typeof value == "number") {
            if (isInt(value)) {
                content = "number:" + Buffer.from(value.toString()).toString("base64");
            }
            else if (isFloat(value)) {
                content = "float:" + Buffer.from(value.toString()).toString("base64");
            }
        }
        this.save(key, content);
    }
    save(key, content) {
        fm.writeFile(this.locationfile(key), content);
    }
    /**
     * Edit database key
     * @param key
     * @param newValue
     * @param by
     * @returns
     */
    edit(key, newValue, by) {
        if (typeof by == "object") {
            const get = this.get(key);
            if (Array.isArray(get)) {
                /**
                 * get index array, if (-1) = not found
                 */
                const getIndex = get.findIndex((predicate) => {
                    // if object by === predicate
                    if (objectEquals(predicate, by))
                        return true;
                    const keysBy = Object.keys(by);
                    let resultLoop = true;
                    for (let index = 0; index < keysBy.length; index++) {
                        const keyBy = keysBy[index];
                        // if not match, it return false (true && false)
                        resultLoop = resultLoop && predicate[keyBy] === by[keyBy];
                    }
                    if (resultLoop)
                        return true;
                });
                if (getIndex > -1) {
                    // set new value
                    get[getIndex] = newValue;
                    this.push(key, get);
                    return true;
                }
                else {
                    if (this.debug)
                        console.error("cannot find index " + key, by);
                    return false;
                }
            }
        }
        else if (!by) {
            this.push(key, newValue);
            return true;
        }
        return false;
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
        const content = fm.readFile(this.locationfile(key)).toString().split(":");
        const value = Buffer.from(content[1], "base64").toString("ascii");
        switch (content[0]) {
            case "object":
            case "array":
                return JSON.parse(value);
            case "float":
                return parseFloat(value);
            case "number":
                return parseInt(value);
            default:
                return value;
        }
    }
    locationfile(key) {
        return path_1.default.join(this.folder, key);
    }
}
function objectEquals(x, y) {
    "use strict";
    if (x === null || x === undefined || y === null || y === undefined) {
        return x === y;
    }
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) {
        return false;
    }
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) {
        return x === y;
    }
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) {
        return x === y;
    }
    if (x === y || x.valueOf() === y.valueOf()) {
        return true;
    }
    if (Array.isArray(x) && x.length !== y.length) {
        return false;
    }
    // if they are dates, they must had equal valueOf
    if (x instanceof Date) {
        return false;
    }
    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) {
        return false;
    }
    if (!(y instanceof Object)) {
        return false;
    }
    // recursive object equality check
    const p = Object.keys(x);
    return (Object.keys(y).every(function (i) {
        return p.indexOf(i) !== -1;
    }) &&
        p.every(function (i) {
            return objectEquals(x[i], y[i]);
        }));
}
module.exports = DBConstructor;
//# sourceMappingURL=construct.js.map