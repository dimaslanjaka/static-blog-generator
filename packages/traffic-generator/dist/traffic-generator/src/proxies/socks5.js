"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var socks5_json_1 = (0, tslib_1.__importDefault)(require("./socks5.json"));
require("../../../hexo-seo/packages/js-prototypes/src/Array");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var cleanup_1 = (0, tslib_1.__importDefault)(require("../../../hexo-seo/src/utils/cleanup"));
var fs_1 = require("fs");
var default_1 = /** @class */ (function () {
    function default_1() {
        this.file = path_1.default.join(__dirname, "socks5.json");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja3M1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Byb3hpZXMvc29ja3M1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJFQUFpQztBQUNqQyw4REFBNEQ7QUFDNUQsMkRBQXdCO0FBQ3hCLDZGQUE4RDtBQUM5RCx5QkFBaUQ7QUFFakQ7SUFBQTtRQUNFLFNBQUksR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztJQTJCN0MsQ0FBQztJQTFCQyxpQ0FBYSxHQUFiO1FBQ0UsSUFBTSxJQUFJLEdBQUcsSUFBQSxpQkFBWSxFQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDeEQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCw2QkFBUyxHQUFUO1FBQ0Usb0JBQW9CO1FBQ3BCLElBQU0sQ0FBQyxHQUFXLHFCQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEMsT0FBTyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCwrQkFBVyxHQUFYLFVBQVksR0FBVztRQUNyQixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEQsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ2QsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDMUI7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLHFCQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzVELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBQSxpQkFBVyxFQUFDLGNBQWMsRUFBRTtZQUMxQixJQUFBLGtCQUFhLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUE1QkQsSUE0QkMifQ==