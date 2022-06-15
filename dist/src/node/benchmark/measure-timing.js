"use strict";
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasureTime = void 0;
var color_1 = __importDefault(require("../color"));
/**
 * Timer measurement
 * @see {@link https://stackoverflow.com/a/69985194/6404439}
 */
var MeasureTime = /** @class */ (function () {
    function MeasureTime() {
        this.startTime = 0;
        this.endTime = 0;
    }
    /**
     * measure time execution
     * @see {@link https://stackoverflow.com/a/70004960/6404439}
     * @param fn
     * @param args
     */
    MeasureTime.prototype.run = function (msg, fn) {
        if (msg === void 0) { msg = null; }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var isFunc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isFunc = typeof fn == 'function';
                        console.log("---measure start [".concat(msg, "]---"));
                        if (!isFunc) return [3 /*break*/, 2];
                        this.start();
                        return [4 /*yield*/, fn.apply.apply(fn, __spreadArray([null], __read(args), false))];
                    case 1:
                        _a.sent();
                        console.log(color_1.default.greenBright(msg), this.end());
                        _a.label = 2;
                    case 2:
                        console.log("---measure end [".concat(msg, "]---"));
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * @see {@link MeasureTime['run']}
     * @param fn
     * @param args
     * @returns
     */
    MeasureTime.prototype.measure = function (fn) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.run.apply(this, __spreadArray([null, fn], __read(args), false));
    };
    MeasureTime.prototype.start = function () {
        this.startTime = new Date().getTime();
        return this;
    };
    /**
     * end indicator
     * @returns dump
     */
    MeasureTime.prototype.end = function () {
        this.endTime = new Date().getTime();
        return this.toString();
    };
    MeasureTime.prototype.toString = function () {
        return "time taken => ".concat((this.endTime - this.startTime) / 1000, " seconds");
    };
    return MeasureTime;
}());
exports.MeasureTime = MeasureTime;
exports.default = MeasureTime;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVhc3VyZS10aW1pbmcuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbm9kZS9iZW5jaG1hcmsvbWVhc3VyZS10aW1pbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1EQUE2QjtBQUU3Qjs7O0dBR0c7QUFDSDtJQUFBO1FBQ1UsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUNkLFlBQU8sR0FBRyxDQUFDLENBQUM7SUErQ3RCLENBQUM7SUE3Q0M7Ozs7O09BS0c7SUFDRyx5QkFBRyxHQUFULFVBQThCLEdBQWtCLEVBQUUsRUFBSztRQUF6QixvQkFBQSxFQUFBLFVBQWtCO1FBQVMsY0FBVTthQUFWLFVBQVUsRUFBVixxQkFBVSxFQUFWLElBQVU7WUFBViw2QkFBVTs7Ozs7Ozt3QkFDM0QsTUFBTSxHQUFHLE9BQU8sRUFBRSxJQUFJLFVBQVUsQ0FBQzt3QkFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBcUIsR0FBRyxTQUFNLENBQUMsQ0FBQzs2QkFFeEMsTUFBTSxFQUFOLHdCQUFNO3dCQUNSLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDYixxQkFBTSxFQUFFLENBQUMsS0FBSyxPQUFSLEVBQUUsaUJBQU8sSUFBSSxVQUFLLElBQUksWUFBQzs7d0JBQTdCLFNBQTZCLENBQUM7d0JBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQzs7O3dCQUdsRCxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUFtQixHQUFHLFNBQU0sQ0FBQyxDQUFDO3dCQUMxQyxzQkFBTyxJQUFJLEVBQUM7Ozs7S0FDYjtJQUVEOzs7OztPQUtHO0lBQ0gsNkJBQU8sR0FBUCxVQUFRLEVBQU87UUFBRSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLDZCQUFjOztRQUM3QixPQUFPLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxpQkFBSyxJQUFJLEVBQUUsRUFBRSxVQUFLLElBQUksV0FBRTtJQUNyQyxDQUFDO0lBRUQsMkJBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN0QyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRDs7O09BR0c7SUFDSCx5QkFBRyxHQUFIO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFDRCw4QkFBUSxHQUFSO1FBQ0UsT0FBTyx3QkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLGFBQVUsQ0FBQztJQUMzRSxDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBakRELElBaURDO0FBakRZLGtDQUFXO0FBa0R4QixrQkFBZSxXQUFXLENBQUMifQ==