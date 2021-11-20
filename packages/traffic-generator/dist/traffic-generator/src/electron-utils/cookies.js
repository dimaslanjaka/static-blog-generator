"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
function default_1(win, partition) {
    win.webContents.on("did-finish-load", function (event) {
        if (!partition) {
            // Query all cookies.
            electron_1.session.defaultSession.cookies
                .get({})
                .then(function (cookies) {
                console.log(cookies);
            })
                .catch(function (error) {
                console.log(error);
            });
        }
    });
}
exports.default = default_1;
function saveCookies(win) {
    win.webContents.session.cookies.get({}).then(function (cookies) {
        console.log(cookies);
    });
}
function restoreCookies(win, cookies) {
    for (var _i = 0, cookies_1 = cookies; _i < cookies_1.length; _i++) {
        var cookie = cookies_1[_i];
        var scheme = cookie.secure ? "https" : "http";
        var host = cookie.domain.startsWith(".")
            ? cookie.domain.substr(1)
            : cookie.domain;
        cookie.url = scheme + "://" + host;
        /*win.webContents.session.cookies.set(cookie, (err) => {
        });*/
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29va2llcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9lbGVjdHJvbi11dGlscy9jb29raWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXdDO0FBRXhDLG1CQUF5QixHQUEyQixFQUFFLFNBQWtCO0lBQ3RFLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLFVBQUMsS0FBSztRQUMxQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QscUJBQXFCO1lBQ3JCLGtCQUFPLENBQUMsY0FBYyxDQUFDLE9BQU87aUJBQzNCLEdBQUcsQ0FBQyxFQUFFLENBQUM7aUJBQ1AsSUFBSSxDQUFDLFVBQUMsT0FBTztnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsVUFBQyxLQUFLO2dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUM7U0FDTjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWRELDRCQWNDO0FBRUQsU0FBUyxXQUFXLENBQUMsR0FBMkI7SUFDOUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxPQUFPO1FBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsR0FBMkIsRUFBRSxPQUFjO0lBQ2pFLEtBQXFCLFVBQU8sRUFBUCxtQkFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTyxFQUFFO1FBQXpCLElBQU0sTUFBTSxnQkFBQTtRQUNmLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ2hELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztZQUN4QyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRWxCLE1BQU0sQ0FBQyxHQUFHLEdBQU0sTUFBTSxXQUFNLElBQU0sQ0FBQztRQUVuQzthQUNLO0tBQ047QUFDSCxDQUFDIn0=