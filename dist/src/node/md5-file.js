"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.md5 = exports.md5FileSync = void 0;
var crypto_1 = __importDefault(require("crypto"));
var fs_1 = __importDefault(require("fs"));
var util_1 = require("util");
function md5FileSync(path) {
    var fileBuffer = Buffer.from(path);
    if (fs_1.default.existsSync(path)) {
        fileBuffer = fs_1.default.readFileSync(path);
    }
    var hashSum = crypto_1.default.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}
exports.md5FileSync = md5FileSync;
/**
 * PHP MD5 Equivalent
 * @param data
 * @returns
 */
function md5(data) {
    if (typeof data !== 'string' || !data) {
        if (typeof data !== 'string') {
            throw new Error('The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received type ' +
                typeof data +
                ' (' +
                (0, util_1.inspect)(data) +
                ') ');
        }
        else {
            throw new Error("the 'data' argument is empty");
        }
    }
    return crypto_1.default.createHash('md5').update(data).digest('hex');
}
exports.md5 = md5;
function md5File(path) {
    return new Promise(function (resolve, reject) {
        var output = crypto_1.default.createHash('md5');
        var input = fs_1.default.createReadStream(path);
        input.on('error', function (err) {
            reject(err);
        });
        output.once('readable', function () {
            resolve(output.read().toString('hex'));
        });
        input.pipe(output);
    });
}
exports.default = md5File;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWQ1LWZpbGUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbm9kZS9tZDUtZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBNEI7QUFDNUIsMENBQW9CO0FBQ3BCLDZCQUErQjtBQUUvQixTQUFnQixXQUFXLENBQUMsSUFBWTtJQUN0QyxJQUFJLFVBQVUsR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNDLElBQUksWUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN2QixVQUFVLEdBQUcsWUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNwQztJQUNELElBQU0sT0FBTyxHQUFHLGdCQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0IsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFSRCxrQ0FRQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixHQUFHLENBQUMsSUFBWTtJQUM5QixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNyQyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxDQUNiLDhHQUE4RztnQkFDNUcsT0FBTyxJQUFJO2dCQUNYLElBQUk7Z0JBQ0osSUFBQSxjQUFPLEVBQUMsSUFBSSxDQUFDO2dCQUNiLElBQUksQ0FDUCxDQUFDO1NBQ0g7YUFBTTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztTQUNqRDtLQUNGO0lBRUQsT0FBTyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFoQkQsa0JBZ0JDO0FBRUQsU0FBd0IsT0FBTyxDQUFDLElBQVk7SUFDMUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1FBQ2pDLElBQU0sTUFBTSxHQUFHLGdCQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLElBQU0sS0FBSyxHQUFHLFlBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV4QyxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLEdBQUc7WUFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUN0QixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFmRCwwQkFlQyJ9