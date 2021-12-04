"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.md5File = exports.md5FileSync = exports.readFile = exports.writeFile = exports.resolveFile = exports.buildFolder = exports.tmpFolder = void 0;
var tslib_1 = require("tslib");
var fs = (0, tslib_1.__importStar)(require("fs"));
var path = (0, tslib_1.__importStar)(require("path"));
var crypto_1 = (0, tslib_1.__importDefault)(require("crypto"));
require("../packages/js-prototypes/src/String");
require("../packages/js-prototypes/src/Array");
require("../packages/js-prototypes/src/Object");
/**
 * Temp folder
 */
exports.tmpFolder = path.join(process.cwd(), "tmp");
exports.buildFolder = path.join(process.cwd(), "build/hexo-seo");
/**
 * resolve dirname of file
 * @param filePath
 * @returns
 */
function resolveFile(filePath) {
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    return filePath;
}
exports.resolveFile = resolveFile;
/**
 * write file nested path
 * @param filePath
 */
function writeFile(filePath, content) {
    resolveFile(filePath);
    fs.writeFileSync(filePath, content);
}
exports.writeFile = writeFile;
/**
 * read file nested path
 * @param filePath
 * @param options
 * @returns
 */
function readFile(filePath, options, autocreate) {
    if (autocreate === void 0) { autocreate = undefined; }
    resolveFile(filePath);
    if (autocreate && !fs.existsSync(filePath)) {
        if (typeof autocreate === "boolean") {
            writeFile(filePath, "");
        }
        else if (autocreate) {
            var text = void 0;
            if (Array.isArray(autocreate) || typeof autocreate === "object") {
                text = JSON.stringify(autocreate);
            }
            writeFile(filePath, text);
        }
        return autocreate;
    }
    return fs.readFileSync(filePath, options);
}
exports.readFile = readFile;
var BUFFER_SIZE = 8192;
function md5FileSync(path) {
    var fd = fs.openSync(path, "r");
    var hash = crypto_1.default.createHash("md5");
    var buffer = Buffer.alloc(BUFFER_SIZE);
    try {
        var bytesRead = void 0;
        do {
            bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE, null);
            hash.update(buffer.slice(0, bytesRead));
        } while (bytesRead === BUFFER_SIZE);
    }
    finally {
        fs.closeSync(fd);
    }
    return hash.digest("hex");
}
exports.md5FileSync = md5FileSync;
function md5File(path) {
    return new Promise(function (resolve, reject) {
        var output = crypto_1.default.createHash("md5");
        var input = fs.createReadStream(path);
        input.on("error", function (err) {
            reject(err);
        });
        output.once("readable", function () {
            resolve(output.read().toString("hex"));
        });
        input.pipe(output);
    });
}
exports.md5File = md5File;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9oZXhvLXNlby9zcmMvZm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLGtEQUF5QjtBQUN6QixzREFBNkI7QUFDN0IsK0RBQTRCO0FBQzVCLGdEQUE4QztBQUM5QywrQ0FBNkM7QUFDN0MsZ0RBQThDO0FBRTlDOztHQUVHO0FBQ1UsUUFBQSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDNUMsUUFBQSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUV0RTs7OztHQUlHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLFFBQWdCO0lBQzFDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtRQUMxQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUMzRDtJQUNELE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFMRCxrQ0FLQztBQUVEOzs7R0FHRztBQUNILFNBQWdCLFNBQVMsQ0FBQyxRQUFnQixFQUFFLE9BQWU7SUFDekQsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RCLEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFIRCw4QkFHQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsUUFBUSxDQUN0QixRQUFnQixFQUNoQixPQWdCUSxFQUNSLFVBQXNCO0lBQXRCLDJCQUFBLEVBQUEsc0JBQXNCO0lBRXRCLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FB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