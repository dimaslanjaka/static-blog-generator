"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var socks5_json_1 = (0, tslib_1.__importDefault)(require("./socks5.json"));
require("../../../hexo-seo/packages/js-prototypes/src/Array");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var cleanup_1 = (0, tslib_1.__importDefault)(require("../../../hexo-seo/src/utils/cleanup"));
var fs_1 = require("fs");
var default_1 = /** @class */ (function () {
    function default_1(winx) {
        this.file = path_1.default.join(__dirname, "socks5.json");
        this.win = winx;
    }
    default_1.prototype.getAllProxies = function () {
        var read = (0, fs_1.readFileSync)(this.file, "utf8").toString();
        var json = JSON.parse(read);
        return json;
    };
    default_1.prototype.getRandom = function () {
        //console.log(list);
        var r = socks5_json_1.default.random();
        return "socks5://" + r;
    };
    default_1.prototype.deleteProxy = function (prx) {
        var proxies = this.getAllProxies();
        console.log("proxy total before", proxies.length);
        proxies.unset(prx);
        var index = proxies.indexOf(prx);
        if (index > -1) {
            proxies.splice(index, 1);
        }
        console.log("proxy total after", socks5_json_1.default.length, proxies[prx]);
        var file = this.file;
        (0, cleanup_1.default)("proxy-socks5", function () {
            (0, fs_1.writeFileSync)(file, JSON.stringify(proxies));
        });
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja3M1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Byb3hpZXMvc29ja3M1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJFQUFpQztBQUNqQyw4REFBNEQ7QUFDNUQsMkRBQXdCO0FBQ3hCLDZGQUE4RDtBQUM5RCx5QkFBaUQ7QUFFakQ7SUFLRSxtQkFBWSxJQUE0QjtRQUp4QyxTQUFJLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFLekMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDbEIsQ0FBQztJQUVELGlDQUFhLEdBQWI7UUFDRSxJQUFNLElBQUksR0FBRyxJQUFBLGlCQUFZLEVBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN4RCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELDZCQUFTLEdBQVQ7UUFDRSxvQkFBb0I7UUFDcEIsSUFBTSxDQUFDLEdBQVcscUJBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQyxPQUFPLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELCtCQUFXLEdBQVgsVUFBWSxHQUFXO1FBQ3JCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRCxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDZCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUMxQjtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUscUJBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDNUQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFBLGlCQUFXLEVBQUMsY0FBYyxFQUFFO1lBQzFCLElBQUEsa0JBQWEsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQW5DRCxJQW1DQyJ9