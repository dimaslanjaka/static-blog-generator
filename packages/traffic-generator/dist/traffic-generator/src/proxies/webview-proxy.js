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
        console.log("[" + partition + "] proxy: " + proxy);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vidmlldy1wcm94eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wcm94aWVzL3dlYnZpZXctcHJveHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLHFDQUFtQztBQUNuQyx3RkFBOEM7QUFFOUMsU0FBUyxZQUFZLENBQ25CLEtBQWEsRUFDYixTQUFvQyxFQUNwQyxRQUlRO0lBTFIsMEJBQUEsRUFBQSxvQ0FBb0M7SUFPcEMsSUFBSSxHQUFHLEdBQUcsa0JBQU8sQ0FBQyxjQUFjLENBQUM7SUFDakMsSUFBSSxPQUFPLFNBQVMsS0FBSyxRQUFRLEVBQUU7UUFDakMsR0FBRyxHQUFHLGtCQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3hDO0lBQ0Qsa0NBQWtDO0lBQ2xDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFJLFNBQVMsaUJBQVksS0FBTyxDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxVQUFDLE9BQU87UUFDckMsSUFDRSxPQUFPLENBQUMsWUFBWSxJQUFJLFdBQVc7WUFDbkMsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUNyQztZQUNBLElBQU0sTUFBTSxHQUFHLENBQUMsZUFBZSxFQUFFLDZCQUE2QixDQUFDLENBQUM7WUFDaEUsNENBQTRDO1lBQzVDLElBQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJO2dCQUNyQyxPQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUExQyxDQUEwQyxDQUMzQyxDQUFDO1lBRUYsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLElBQUksT0FBTyxRQUFRLEtBQUssVUFBVSxFQUFFO29CQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDOUQsUUFBUSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7aUJBQ3JDO2FBQ0Y7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDMUQ7U0FDRjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLFdBQVcsQ0FBQyxHQUFXO0lBQzlCLDJDQUEyQztJQUMzQyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUM5QixPQUFPLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztLQUM5QjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELFNBQWdCLEtBQUssQ0FBQyxHQUFXO0lBQy9CLEdBQUcsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sb0JBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQztJQUN0RCxPQUFPLE9BQU8sb0JBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLENBQUM7QUFDdEMsQ0FBQztBQUpELHNCQUlDO0FBRUQsa0JBQWUsWUFBWSxDQUFDIn0=