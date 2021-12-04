"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var sslproxies_json_1 = (0, tslib_1.__importDefault)(require("../__test__/data/sslproxies.json"));
var https_json_1 = (0, tslib_1.__importDefault)(require("./https.json"));
require("../../../hexo-seo/packages/js-prototypes/src/Array");
var cleanup_1 = (0, tslib_1.__importDefault)(require("../../../hexo-seo/src/utils/cleanup"));
var list = [];
var default_1 = /** @class */ (function () {
    function default_1(winx) {
        this.file = path_1.default.join(__dirname, "../__test__/data/sslproxies.json");
        this.win = winx;
        list = list.concat(this.concatProxies());
    }
    default_1.prototype.concatProxies = function () {
        var fileProxies = [
            path_1.default.join(__dirname, "../__test__/data/sslproxies.json"),
            path_1.default.join(__dirname, "./https.json")
        ];
        fileProxies.map(function (file) {
            var read = (0, fs_1.readFileSync)(file, "utf8").toString();
            try {
                var json = JSON.parse(read);
                if (Array.isArray(json)) {
                    list = list.concat(json).unique().shuffle();
                }
            }
            catch (error) {
                return;
            }
        });
        return list;
    };
    default_1.prototype.fold = function () {
        return https_json_1.default.concat(sslproxies_json_1.default);
    };
    default_1.prototype.getAllProxies = function () {
        return this.concatProxies();
    };
    default_1.prototype.getRandom = function () {
        //console.log(list);
        var r = list.random();
        return "http://" + r;
    };
    default_1.prototype.deleteProxy = function (prx) {
        prx = prx.replace(/^(socks?[54]|https?):\/\//gs, "");
        var proxies = this.getAllProxies();
        console.log("proxy total before", proxies.length);
        proxies.unset(prx);
        var index = proxies.indexOf(prx);
        if (index > -1) {
            proxies.splice(index, 1);
        }
        console.log("proxy total after", proxies.length, [prx, index]);
        var file = this.file;
        (0, cleanup_1.default)("proxy-https", function () {
            (0, fs_1.writeFileSync)(file, JSON.stringify(proxies));
        });
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJveGllcy9odHRwcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBaUQ7QUFDakQsMkRBQXdCO0FBQ3hCLGtHQUEwRDtBQUMxRCx5RUFBd0M7QUFDeEMsOERBQTREO0FBQzVELDZGQUE4RDtBQUU5RCxJQUFJLElBQUksR0FBYSxFQUFFLENBQUM7QUFFeEI7SUFJRSxtQkFBWSxJQUE0QjtRQUh4QyxTQUFJLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztRQUk5RCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU8saUNBQWEsR0FBckI7UUFDRSxJQUFNLFdBQVcsR0FBRztZQUNsQixjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxrQ0FBa0MsQ0FBQztZQUN4RCxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUM7U0FDckMsQ0FBQztRQUNGLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJO1lBQ25CLElBQU0sSUFBSSxHQUFHLElBQUEsaUJBQVksRUFBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkQsSUFBSTtnQkFDRixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM5QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ3ZCLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO2lCQUM3QzthQUNGO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsT0FBTzthQUNSO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyx3QkFBSSxHQUFaO1FBQ0UsT0FBTyxvQkFBWSxDQUFDLE1BQU0sQ0FBQyx5QkFBVSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELGlDQUFhLEdBQWI7UUFDRSxPQUFPLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQsNkJBQVMsR0FBVDtRQUNFLG9CQUFvQjtRQUNwQixJQUFNLENBQUMsR0FBVyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEMsT0FBTyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCwrQkFBVyxHQUFYLFVBQVksR0FBVztRQUNyQixHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyRCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEQsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ2QsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDMUI7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMvRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLElBQUEsaUJBQVcsRUFBQyxhQUFhLEVBQUU7WUFDekIsSUFBQSxrQkFBYSxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBekRELElBeURDIn0=