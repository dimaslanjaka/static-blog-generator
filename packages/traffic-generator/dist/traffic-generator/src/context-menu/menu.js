"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _1 = (0, tslib_1.__importDefault)(require("."));
var electron_1 = require("electron");
function default_1() {
    //console.log("context menu show");
    return (0, _1.default)({
        prepend: function (_defaultActions, parameters, _browserWindow) { return [
            {
                label: "Rainbow",
                // Only show it when right-clicking images
                visible: parameters.mediaType === "image"
            },
            {
                label: "Search Google",
                // Only show it when right-clicking text
                visible: parameters.selectionText.trim().length > 0,
                click: function () {
                    electron_1.shell
                        .openExternal("https://google.com/search?q=" + encodeURIComponent(parameters.selectionText))
                        .then(function (r) { return console.log(r); });
                }
            },
            {
                label: "Open Settings",
                click: function () {
                    var settings = {
                        height: 500,
                        width: 400,
                        titleBarStyle: "hidden",
                        webPreferences: {
                            nodeIntegration: true,
                            enableRemoteModule: true
                        }
                    };
                    if (process.platform == "win32") {
                        settings.frame = false;
                    }
                    else {
                        settings.titleBarStyle = "hidden";
                    }
                    var win = new electron_1.BrowserWindow(settings);
                    win.loadFile("views/settings.html").then(function (r) { return console.log(r); });
                }
            }
        ]; }
    });
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb250ZXh0LW1lbnUvbWVudS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvREFBNEI7QUFDNUIscUNBQWdEO0FBRWhEO0lBQ0UsbUNBQW1DO0lBQ25DLE9BQU8sSUFBQSxVQUFXLEVBQUM7UUFDakIsT0FBTyxFQUFFLFVBQUMsZUFBZSxFQUFFLFVBQVUsRUFBRSxjQUFjLElBQUssT0FBQTtZQUN4RDtnQkFDRSxLQUFLLEVBQUUsU0FBUztnQkFDaEIsMENBQTBDO2dCQUMxQyxPQUFPLEVBQUUsVUFBVSxDQUFDLFNBQVMsS0FBSyxPQUFPO2FBQzFDO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLGVBQWU7Z0JBQ3RCLHdDQUF3QztnQkFDeEMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQ25ELEtBQUssRUFBRTtvQkFDTCxnQkFBSzt5QkFDRixZQUFZLENBQ1gsaUNBQStCLGtCQUFrQixDQUMvQyxVQUFVLENBQUMsYUFBYSxDQUN2QixDQUNKO3lCQUNBLElBQUksQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQWQsQ0FBYyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7YUFDRjtZQUNEO2dCQUNFLEtBQUssRUFBRSxlQUFlO2dCQUN0QixLQUFLLEVBQUU7b0JBQ0wsSUFBTSxRQUFRLEdBQTZDO3dCQUN6RCxNQUFNLEVBQUUsR0FBRzt3QkFDWCxLQUFLLEVBQUUsR0FBRzt3QkFDVixhQUFhLEVBQUUsUUFBUTt3QkFDdkIsY0FBYyxFQUFFOzRCQUNkLGVBQWUsRUFBRSxJQUFJOzRCQUNyQixrQkFBa0IsRUFBRSxJQUFJO3lCQUN6QjtxQkFDRixDQUFDO29CQUNGLElBQUksT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLEVBQUU7d0JBQy9CLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO3FCQUN4Qjt5QkFBTTt3QkFDTCxRQUFRLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQztxQkFDbkM7b0JBRUQsSUFBTSxHQUFHLEdBQUcsSUFBSSx3QkFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN4QyxHQUFHLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBZCxDQUFjLENBQUMsQ0FBQztnQkFDbEUsQ0FBQzthQUNGO1NBQ0YsRUExQ3lELENBMEN6RDtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUEvQ0QsNEJBK0NDIn0=