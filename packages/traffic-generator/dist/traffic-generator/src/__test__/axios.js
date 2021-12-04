"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.random = void 0;
var tslib_1 = require("tslib");
/* eslint-disable import/extensions */
var axios_1 = (0, tslib_1.__importDefault)(require("axios"));
var spys_txt_1 = require("../../packages/proxy-grabber/src/parser/spys.txt");
var db_1 = (0, tslib_1.__importDefault)(require("../../packages/proxy-grabber/src/db"));
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var moment_1 = (0, tslib_1.__importDefault)(require("moment"));
//import "../../../hexo-seo/packages/js-prototypes/src/Array";
require("../../../hexo-seo/packages/js-prototypes/src/globals");
var db = new db_1.default(path_1.default.join(process.cwd(), "databases/proxies"));
var instance = axios_1.default.create({
    baseURL: "https://google.com/",
    timeout: 1000,
    headers: { "X-Custom-Header": "foobar" },
    // `maxRedirects` defines the maximum number of redirects to follow in node.js.
    // If set to 0, no redirects will be followed.
    maxRedirects: 5
});
var lastUpdated = db.exists("/sslProxiesOrg/lastUpdated")
    ? db.get("/sslProxiesOrg/lastUpdated")
    : 100;
if ((0, moment_1.default)().diff(lastUpdated, "days") > 3) {
    instance.get("http://spys.me/proxy.txt").then(function (response) {
        var parsed = (0, spys_txt_1.parser)(response.data);
        db.push("/spys/proxies", parsed);
        db.push("/spys/lastUpdated", new Date());
    });
}
var get = db.get("/spys/proxies");
/**
 * TYPE://IP:PORT
 */
var result = [];
get.forEach(function (ret) {
    result.push(ret.type + "://" + ret.proxy);
});
exports.default = result;
var random = function () {
    return result.shuffle().random();
};
exports.random = random;
function remove(proxy) {
    if (typeof result[proxy] == "string") {
        if (typeof proxy == "number")
            result.deleteAt(proxy);
        else
            result.unset(proxy);
        db.edit("/spys/proxies", result);
    }
    return result;
}
exports.remove = remove;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXhpb3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvX190ZXN0X18vYXhpb3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLHNDQUFzQztBQUN0Qyw2REFBMEI7QUFDMUIsNkVBRzBEO0FBQzFELHdGQUFzRDtBQUN0RCwyREFBd0I7QUFDeEIsK0RBQTRCO0FBQzVCLDhEQUE4RDtBQUM5RCxnRUFBOEQ7QUFFOUQsSUFBTSxFQUFFLEdBQUcsSUFBSSxZQUFHLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLElBQU0sUUFBUSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUM7SUFDNUIsT0FBTyxFQUFFLHFCQUFxQjtJQUM5QixPQUFPLEVBQUUsSUFBSTtJQUNiLE9BQU8sRUFBRSxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRTtJQUN4QywrRUFBK0U7SUFDL0UsOENBQThDO0lBQzlDLFlBQVksRUFBRSxDQUFDO0NBQ2hCLENBQUMsQ0FBQztBQUVILElBQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsNEJBQTRCLENBQUM7SUFDekQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUM7SUFDdEMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUNSLElBQUksSUFBQSxnQkFBTSxHQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDMUMsUUFBUSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLFFBQVE7UUFDckQsSUFBTSxNQUFNLEdBQUcsSUFBQSxpQkFBSSxFQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqQyxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUMsQ0FBQztDQUNKO0FBRUQsSUFBTSxHQUFHLEdBQWdCLEVBQUUsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDakQ7O0dBRUc7QUFDSCxJQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7QUFDNUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7SUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFlLE1BQU0sQ0FBQztBQUNmLElBQU0sTUFBTSxHQUFHO0lBQ3BCLE9BQU8sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ25DLENBQUMsQ0FBQztBQUZXLFFBQUEsTUFBTSxVQUVqQjtBQUNGLFNBQWdCLE1BQU0sQ0FBQyxLQUFzQjtJQUMzQyxJQUFJLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLFFBQVEsRUFBRTtRQUNwQyxJQUFJLE9BQU8sS0FBSyxJQUFJLFFBQVE7WUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztZQUNoRCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ2xDO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQVBELHdCQU9DIn0=