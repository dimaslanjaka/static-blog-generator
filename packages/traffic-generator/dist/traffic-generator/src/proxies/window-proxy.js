"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Electron Browser Window Proxy
 * @param win
 * @param proxy ex "socks5://88.198.50.103:1080"
 */
function windowProxy(win, proxy, callback) {
    win.webContents.session
        .setProxy({ proxyRules: proxy })
        .then(function () {
        win.loadURL("https://www.webmanajemen.com/page/bot-detect");
    })
        .catch(function (err) { });
    /* Set did-fail-load listener once, load default view */
    win.webContents.on("did-fail-load", function (event, errorCode, errorDescription, validatedURL, isMainFrame, frameProcessId, frameRoutingId) {
        if (typeof callback == "function" && isMainFrame) {
            callback(proxy, errorCode, errorDescription, validatedURL, isMainFrame);
        }
    });
    win.webContents.on("did-finish-load", function () {
        var title = win.getTitle();
        if (title.toLowerCase().startsWith("attention required!")) {
            if (typeof callback === "function") {
                callback(proxy, null, "Proxy blocked by cloudflare", win.webContents.getURL(), null);
            }
        }
        //console.log(win.getTitle());
    });
}
exports.default = windowProxy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LXByb3h5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Byb3hpZXMvd2luZG93LXByb3h5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7R0FJRztBQUNILFNBQVMsV0FBVyxDQUNsQixHQUEyQixFQUMzQixLQUFhLEVBQ2IsUUFNUTtJQUVSLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTztTQUNwQixRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUM7U0FDL0IsSUFBSSxDQUFDO1FBQ0osR0FBRyxDQUFDLE9BQU8sQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0lBQzlELENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxVQUFDLEdBQUcsSUFBTSxDQUFDLENBQUMsQ0FBQztJQUV0Qix3REFBd0Q7SUFDeEQsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQ2hCLGVBQWUsRUFDZixVQUNFLEtBQXFCLEVBQ3JCLFNBQWlCLEVBQ2pCLGdCQUF3QixFQUN4QixZQUFvQixFQUNwQixXQUFvQixFQUNwQixjQUFzQixFQUN0QixjQUFzQjtRQUV0QixJQUFJLE9BQU8sUUFBUSxJQUFJLFVBQVUsSUFBSSxXQUFXLEVBQUU7WUFDaEQsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ3pFO0lBQ0gsQ0FBQyxDQUNGLENBQUM7SUFFRixHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRTtRQUNwQyxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDN0IsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLEVBQUU7WUFDekQsSUFBSSxPQUFPLFFBQVEsS0FBSyxVQUFVLEVBQUU7Z0JBQ2xDLFFBQVEsQ0FDTixLQUFLLEVBQ0wsSUFBSSxFQUNKLDZCQUE2QixFQUM3QixHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUN4QixJQUFJLENBQ0wsQ0FBQzthQUNIO1NBQ0Y7UUFDRCw4QkFBOEI7SUFDaEMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsa0JBQWUsV0FBVyxDQUFDIn0=