"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var node_libcurl_1 = require("node-libcurl");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var ads = ["https://adaway.org/hosts.txt"];
function get(url) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var _a, statusCode, data, headers, _ref, _hosts, _i, _len, line, md;
        return (0, tslib_1.__generator)(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, node_libcurl_1.curly.get(url)];
                case 1:
                    _a = _b.sent(), statusCode = _a.statusCode, data = _a.data, headers = _a.headers;
                    _ref = data.replace(/#.*/g, "").split(/[\r\n]/);
                    _hosts = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        line = _ref[_i];
                        md = /(\d+\.\d+\.\d+\.\d+)\s+(.+)/.exec(line);
                        if (md) {
                            //obj[md[1]] = _.union(obj[md[1]] || [], md[2].trim().split(/\s+/));
                            _hosts.push({
                                host: md[1],
                                domain: md[2]
                            });
                        }
                    }
                    return [2 /*return*/, _hosts];
            }
        });
    });
}
var hosts = [];
var adsx = ads.map(function (ad) {
    return get(ad).then(function (arr) {
        var arrays = arr.map(function (arr) {
            return arr.domain;
        });
        hosts = hosts.concat(arrays);
        return hosts;
    });
});
var fileHosts = path_1.default.join(__dirname, "data/hosts.json");
adsx.map(function (adsx) {
    if (!(0, fs_1.existsSync)(path_1.default.dirname(fileHosts))) {
        (0, fs_1.mkdirSync)(path_1.default.dirname(fileHosts));
    }
    (0, fs_1.writeFileSync)(fileHosts, JSON.stringify(hosts));
});
function default_1() {
    return JSON.parse((0, fs_1.readFileSync)(fileHosts).toString());
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRhd2F5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL19fdGVzdF9fL2FkYXdheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBd0U7QUFDeEUsNkNBQXFDO0FBQ3JDLDJEQUF3QjtBQUV4QixJQUFNLEdBQUcsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFFN0MsU0FBZSxHQUFHLENBQUMsR0FBVzs7Ozs7d0JBQ1UscUJBQU0sb0JBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUE7O29CQUFwRCxLQUFnQyxTQUFvQixFQUFsRCxVQUFVLGdCQUFBLEVBQUUsSUFBSSxVQUFBLEVBQUUsT0FBTyxhQUFBO29CQUUzQixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNoRCxNQUFNLEdBR04sRUFBRSxDQUFDO29CQUNULEtBQVMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFO3dCQUM5QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNoQixFQUFFLEdBQUcsNkJBQTZCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNwRCxJQUFJLEVBQUUsRUFBRTs0QkFDTixvRUFBb0U7NEJBQ3BFLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0NBQ1YsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0NBQ1gsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7NkJBQ2QsQ0FBQyxDQUFDO3lCQUNKO3FCQUNGO29CQUNELHNCQUFPLE1BQU0sRUFBQzs7OztDQUNmO0FBQ0QsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBRWYsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQUU7SUFDdEIsT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBRztRQUN0QixJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBRztZQUN6QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7UUFDSCxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixPQUFPLEtBQUssQ0FBQztJQUNmLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFNLFNBQVMsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBRTFELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJO0lBQ1osSUFBSSxDQUFDLElBQUEsZUFBVSxFQUFDLGNBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRTtRQUN4QyxJQUFBLGNBQVMsRUFBQyxjQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7S0FDcEM7SUFDRCxJQUFBLGtCQUFhLEVBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNsRCxDQUFDLENBQUMsQ0FBQztBQUVIO0lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUEsaUJBQVksRUFBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFGRCw0QkFFQyJ9