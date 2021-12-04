"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var fs_2 = require("fs");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
module.exports = function (webview) {
    // we can get its URL and display it in the console
    var currentURL = new URL(webview.getURL());
    //console.log("currentURL is : " + currentURL);
    // same thing about the title of the page
    var titlePage = webview.getTitle();
    //console.log("titlePage is : " + titlePage);
    // executing Javascript into the webview to get the full HTML
    webview
        .executeJavaScript("function gethtml () {\nreturn new Promise((resolve, reject) => { resolve(document.documentElement.innerHTML); });\n}\ngethtml();")
        .then(
    /**
     * @param {string} html
     */
    function (html) {
        // save HTML
        var savePath = path_1.default.join(process.cwd(), "build/html", currentURL.host, currentURL.pathname, titlePage + ".html");
        (0, fs_2.mkdirSync)(path_1.default.dirname(savePath), { recursive: true });
        (0, fs_1.writeFileSync)(savePath, html);
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vidmlldy1nZXRodG1sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3ZpZXdzL2pzL3dlYnZpZXctZ2V0aHRtbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBbUM7QUFDbkMseUJBQStCO0FBQy9CLDJEQUF3QjtBQUV4QixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsT0FBNEI7SUFDckQsbURBQW1EO0lBQ25ELElBQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLCtDQUErQztJQUUvQyx5Q0FBeUM7SUFDekMsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3JDLDZDQUE2QztJQUU3Qyw2REFBNkQ7SUFDN0QsT0FBTztTQUNKLGlCQUFpQixDQUNoQixrSUFHSyxDQUNOO1NBQ0EsSUFBSTtJQUNIOztPQUVHO0lBQ0gsVUFBQyxJQUFJO1FBQ0gsWUFBWTtRQUNaLElBQU0sUUFBUSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQ3hCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFDYixZQUFZLEVBQ1osVUFBVSxDQUFDLElBQUksRUFDZixVQUFVLENBQUMsUUFBUSxFQUNoQixTQUFTLFVBQU8sQ0FDcEIsQ0FBQztRQUNGLElBQUEsY0FBUyxFQUFDLGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN2RCxJQUFBLGtCQUFhLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2hDLENBQUMsQ0FDRixDQUFDO0FBQ04sQ0FBQyxDQUFDIn0=