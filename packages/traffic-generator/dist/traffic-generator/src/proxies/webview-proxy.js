"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAds = void 0;
var tslib_1 = require("tslib");
var electron_1 = require("electron");
var hosts_json_1 = (0, tslib_1.__importDefault)(require("../__test__/data/hosts.json"));
function webviewProxy(proxy, partition, callback) {
    if (partition === void 0) { partition = "persist:webviewsession"; }
    var ses = electron_1.session.defaultSession;
    if (typeof partition === "string") {
        ses = electron_1.session.fromPartition(partition);
    }
    //console.log(ses.getUserAgent());
    ses.setProxy({ proxyRules: proxy }).then(function () {
        console.log("injected [" + partition + "] with proxy: " + proxy);
    });
    ses.webRequest.onErrorOccurred(function (details) {
        if (details.resourceType == "mainFrame" &&
            !isAds(new URL(details.url).hostname)) {
            var errors = ["ERR_TIMED_OUT", "ERR_PROXY_CONNECTION_FAILED"];
            // check if the string has some of the terms
            var hasProxyError = errors.some(function (term) {
                return details.error.toUpperCase().includes(term);
            });
            if (hasProxyError) {
                if (typeof callback === "function") {
                    console.log("Proxy error", details.resourceType, details.url);
                    callback(details, proxy, partition);
                }
            }
            else {
                console.log("request error", details.error, details.url);
            }
        }
    });
}
/**
 * extract host from url
 * @param url
 * @returns
 */
function extracthost(url) {
    // if url is valid, parsing and return host
    if (/^https?:\/\//gs.test(url)) {
        return new URL(url).hostname;
    }
    return url;
}
function isAds(url) {
    url = extracthost(url);
    console.log("ads", url, typeof hosts_json_1.default[url] === "string");
    return typeof hosts_json_1.default[url] === "string";
}
exports.isAds = isAds;
exports.default = webviewProxy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vidmlldy1wcm94eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wcm94aWVzL3dlYnZpZXctcHJveHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLHFDQUFtQztBQUNuQyx3RkFBOEM7QUFFOUMsU0FBUyxZQUFZLENBQ25CLEtBQWEsRUFDYixTQUFvQyxFQUNwQyxRQUlRO0lBTFIsMEJBQUEsRUFBQSxvQ0FBb0M7SUFPcEMsSUFBSSxHQUFHLEdBQUcsa0JBQU8sQ0FBQyxjQUFjLENBQUM7SUFDakMsSUFBSSxPQUFPLFNBQVMsS0FBSyxRQUFRLEVBQUU7UUFDakMsR0FBRyxHQUFHLGtCQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3hDO0lBQ0Qsa0NBQWtDO0lBQ2xDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFhLFNBQVMsc0JBQWlCLEtBQU8sQ0FBQyxDQUFDO0lBQzlELENBQUMsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsVUFBQyxPQUFPO1FBQ3JDLElBQ0UsT0FBTyxDQUFDLFlBQVksSUFBSSxXQUFXO1lBQ25DLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFDckM7WUFDQSxJQUFNLE1BQU0sR0FBRyxDQUFDLGVBQWUsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO1lBQ2hFLDRDQUE0QztZQUM1QyxJQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSTtnQkFDckMsT0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFBMUMsQ0FBMEMsQ0FDM0MsQ0FBQztZQUVGLElBQUksYUFBYSxFQUFFO2dCQUNqQixJQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsRUFBRTtvQkFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzlELFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2lCQUNyQzthQUNGO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzFEO1NBQ0Y7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxXQUFXLENBQUMsR0FBVztJQUM5QiwyQ0FBMkM7SUFDM0MsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDOUIsT0FBTyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7S0FDOUI7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxTQUFnQixLQUFLLENBQUMsR0FBVztJQUMvQixHQUFHLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLG9CQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUM7SUFDdEQsT0FBTyxPQUFPLG9CQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxDQUFDO0FBQ3RDLENBQUM7QUFKRCxzQkFJQztBQUVELGtCQUFlLFlBQVksQ0FBQyJ9