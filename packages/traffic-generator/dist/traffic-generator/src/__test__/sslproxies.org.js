"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var jsdom_1 = require("jsdom");
var node_libcurl_1 = require("node-libcurl");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var url = "https://www.sslproxies.org/";
function get(url) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var _a, statusCode, data, headers;
        return (0, tslib_1.__generator)(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, node_libcurl_1.curly.get(url)];
                case 1:
                    _a = _b.sent(), statusCode = _a.statusCode, data = _a.data, headers = _a.headers;
                    return [2 /*return*/, data];
            }
        });
    });
}
var jsonFile = path_1.default.join(__dirname, "data/sslproxies.json");
if (!(0, fs_1.existsSync)(path_1.default.dirname(jsonFile))) {
    (0, fs_1.mkdirSync)(path_1.default.dirname(jsonFile), { recursive: true });
}
get(url).then(function (response) {
    var proxies = [];
    var dom = new jsdom_1.JSDOM(response);
    var document = dom.window.document;
    var tr = document.querySelectorAll("tbody tr");
    tr.forEach(function (node) {
        var td = node.querySelectorAll("td");
        var text = td[0].textContent + ":" + td[1].textContent;
        if (/^\d/g.test(text) && text.length > 2) {
            proxies.push(text);
        }
    });
    (0, fs_1.writeFileSync)(jsonFile, JSON.stringify(proxies));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NscHJveGllcy5vcmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvX190ZXN0X18vc3NscHJveGllcy5vcmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXdFO0FBQ3hFLCtCQUE4QjtBQUM5Qiw2Q0FBcUM7QUFDckMsMkRBQXdCO0FBRXhCLElBQU0sR0FBRyxHQUFHLDZCQUE2QixDQUFDO0FBRTFDLFNBQWUsR0FBRyxDQUFDLEdBQVc7Ozs7O3dCQUNVLHFCQUFNLG9CQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFBOztvQkFBcEQsS0FBZ0MsU0FBb0IsRUFBbEQsVUFBVSxnQkFBQSxFQUFFLElBQUksVUFBQSxFQUFFLE9BQU8sYUFBQTtvQkFDakMsc0JBQU8sSUFBSSxFQUFDOzs7O0NBQ2I7QUFDRCxJQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBQzlELElBQUksQ0FBQyxJQUFBLGVBQVUsRUFBQyxjQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUU7SUFDdkMsSUFBQSxjQUFTLEVBQUMsY0FBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0NBQ3hEO0FBQ0QsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLFFBQVE7SUFDckIsSUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO0lBQzdCLElBQU0sR0FBRyxHQUFHLElBQUksYUFBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hDLElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ3JDLElBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtRQUNkLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxJQUFNLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO1FBQ3pELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN4QyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFBLGtCQUFhLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNuRCxDQUFDLENBQUMsQ0FBQyJ9