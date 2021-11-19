/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// noinspection JSIgnoredPromiseFromCall
var fs = require("fs");
var path = require("path");
///require("./menu");
onload = function () {
    /**
     * @typedef {Element|import('electron').webviewTag}
     * @type {Element|import('electron').webviewTag}
     */
    var webview = document.querySelector("webview");
    var indicator = document.querySelector(".indicator");
    /**
     * @type {HTMLInputElement}
     */
    var addrBar = document.getElementById("addr-bar");
    webview.addEventListener("ipc-message", function (e) {
        if (e.channel === "html-content") {
            var html_contents = e.args[0];
            console.log(html_contents);
        }
    });
    var firstLoad = true;
    webview.addEventListener("dom-ready", function () {
        // clear log every page
        console.clear();
        // load webview default from url bar
        if (firstLoad) {
            firstLoad = false;
            /*setTimeout(function () {
              webview.loadURL(addrBar.value);
            }, 1500);*/
        }
        else {
            addrBar.value = webview.getURL();
        }
        // we can get its URL and display it in the console
        var currentURL = new URL(webview.getURL());
        console.log("currentURL is : " + currentURL);
        // same thing about the title of the page
        var titlePage = webview.getTitle();
        console.log("titlePage is : " + titlePage);
        // executing Javascript into the webview to get the full HTML
        webview
            .executeJavaScript("function gethtml () {\n    return new Promise((resolve, reject) => { resolve(document.documentElement.innerHTML); });\n    }\n    gethtml();")
            .then(
        /**
         * @param {string} html
         */
        function (html) {
            // save HTML
            var savePath = path.join(process.cwd(), "build/html", currentURL.host, currentURL.pathname, "".concat(titlePage, ".html"));
            fs.mkdirSync(path.dirname(savePath), { recursive: true });
            fs.writeFileSync(savePath, html);
        });
    });
    // listen url address enter
    addrBar.addEventListener("keydown", function (event) {
        var val = this.value;
        if (event.key === "Enter") {
            console.log(val);
        }
    });
    if (indicator) {
        var loadstart = function () {
            indicator.innerText = "loading...";
        };
        var loadstop = function () {
            indicator.innerText = "";
        };
        webview.addEventListener("did-start-loading", loadstart);
        webview.addEventListener("did-stop-loading", loadstop);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy92aWV3cy9qcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDZCQUE2QjtBQUM3Qix1REFBdUQ7QUFDdkQsd0NBQXdDO0FBRXhDLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IscUJBQXFCO0FBRXJCLE1BQU0sR0FBRztJQUNQOzs7T0FHRztJQUNILElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEQsSUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN2RDs7T0FFRztJQUNILElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFcEQsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUM7UUFDakQsSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLGNBQWMsRUFBRTtZQUNoQyxJQUFNLGFBQWEsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDNUI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztJQUNyQixPQUFPLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFO1FBQ3BDLHVCQUF1QjtRQUN2QixPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFaEIsb0NBQW9DO1FBQ3BDLElBQUksU0FBUyxFQUFFO1lBQ2IsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUNsQjs7dUJBRVc7U0FDWjthQUFNO1lBQ0wsT0FBTyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDbEM7UUFFRCxtREFBbUQ7UUFDbkQsSUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLENBQUMsQ0FBQztRQUU3Qyx5Q0FBeUM7UUFDekMsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDLENBQUM7UUFFM0MsNkRBQTZEO1FBQzdELE9BQU87YUFDSixpQkFBaUIsQ0FDaEIsOElBR08sQ0FDUjthQUNBLElBQUk7UUFDSDs7V0FFRztRQUNILFVBQUMsSUFBSTtZQUNILFlBQVk7WUFDWixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUN4QixPQUFPLENBQUMsR0FBRyxFQUFFLEVBQ2IsWUFBWSxFQUNaLFVBQVUsQ0FBQyxJQUFJLEVBQ2YsVUFBVSxDQUFDLFFBQVEsRUFDbkIsVUFBRyxTQUFTLFVBQU8sQ0FDcEIsQ0FBQztZQUNGLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzFELEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FDRixDQUFDO0lBQ04sQ0FBQyxDQUFDLENBQUM7SUFFSCwyQkFBMkI7SUFDM0IsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFVLEtBQUs7UUFDakQsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN2QixJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssT0FBTyxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksU0FBUyxFQUFFO1FBQ2IsSUFBTSxTQUFTLEdBQUc7WUFDaEIsU0FBUyxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUM7UUFDckMsQ0FBQyxDQUFDO1FBRUYsSUFBTSxRQUFRLEdBQUc7WUFDZixTQUFTLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUMzQixDQUFDLENBQUM7UUFFRixPQUFPLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDekQsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3hEO0FBQ0gsQ0FBQyxDQUFDIn0=