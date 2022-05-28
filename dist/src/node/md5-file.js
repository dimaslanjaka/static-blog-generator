"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.md5 = exports.md5FileSync = void 0;
var crypto_1 = __importDefault(require("crypto"));
var fs_1 = __importDefault(require("fs"));
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
                typeof data);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWQ1LWZpbGUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbm9kZS9tZDUtZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBNEI7QUFDNUIsMENBQW9CO0FBRXBCLFNBQWdCLFdBQVcsQ0FBQyxJQUFZO0lBQ3RDLElBQUksVUFBVSxHQUFXLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0MsSUFBSSxZQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3ZCLFVBQVUsR0FBRyxZQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3BDO0lBQ0QsSUFBTSxPQUFPLEdBQUcsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMzQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQVJELGtDQVFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLEdBQUcsQ0FBQyxJQUFZO0lBQzlCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ3JDLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQ2IsOEdBQThHO2dCQUM1RyxPQUFPLElBQUksQ0FDZCxDQUFDO1NBQ0g7YUFBTTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztTQUNqRDtLQUNGO0lBRUQsT0FBTyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFiRCxrQkFhQztBQUVELFNBQXdCLE9BQU8sQ0FBQyxJQUFZO0lBQzFDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtRQUNqQyxJQUFNLE1BQU0sR0FBRyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxJQUFNLEtBQUssR0FBRyxZQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBQyxHQUFHO1lBQ3BCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDdEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBZkQsMEJBZUMifQ==