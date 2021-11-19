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
                        .openExternal("https://google.com/search?q=".concat(encodeURIComponent(parameters.selectionText)))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb250ZXh0LW1lbnUvbWVudS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvREFBNEI7QUFDNUIscUNBQWdEO0FBRWhEO0lBQ0UsbUNBQW1DO0lBQ25DLE9BQU8sSUFBQSxVQUFXLEVBQUM7UUFDakIsT0FBTyxFQUFFLFVBQUMsZUFBZSxFQUFFLFVBQVUsRUFBRSxjQUFjLElBQUssT0FBQTtZQUN4RDtnQkFDRSxLQUFLLEVBQUUsU0FBUztnQkFDaEIsMENBQTBDO2dCQUMxQyxPQUFPLEVBQUUsVUFBVSxDQUFDLFNBQVMsS0FBSyxPQUFPO2FBQzFDO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLGVBQWU7Z0JBQ3RCLHdDQUF3QztnQkFDeEMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQ25ELEtBQUssRUFBRTtvQkFDTCxnQkFBSzt5QkFDRixZQUFZLENBQ1gsc0NBQStCLGtCQUFrQixDQUMvQyxVQUFVLENBQUMsYUFBYSxDQUN6QixDQUFFLENBQ0o7eUJBQ0EsSUFBSSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBZCxDQUFjLENBQUMsQ0FBQztnQkFDakMsQ0FBQzthQUNGO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLGVBQWU7Z0JBQ3RCLEtBQUssRUFBRTtvQkFDTCxJQUFNLFFBQVEsR0FBNkM7d0JBQ3pELE1BQU0sRUFBRSxHQUFHO3dCQUNYLEtBQUssRUFBRSxHQUFHO3dCQUNWLGFBQWEsRUFBRSxRQUFRO3dCQUN2QixjQUFjLEVBQUU7NEJBQ2QsZUFBZSxFQUFFLElBQUk7NEJBQ3JCLGtCQUFrQixFQUFFLElBQUk7eUJBQ3pCO3FCQUNGLENBQUM7b0JBQ0YsSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sRUFBRTt3QkFDL0IsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7cUJBQ3hCO3lCQUFNO3dCQUNMLFFBQVEsQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDO3FCQUNuQztvQkFFRCxJQUFNLEdBQUcsR0FBRyxJQUFJLHdCQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3hDLEdBQUcsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFkLENBQWMsQ0FBQyxDQUFDO2dCQUNsRSxDQUFDO2FBQ0Y7U0FDRixFQTFDeUQsQ0EwQ3pEO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQS9DRCw0QkErQ0MifQ==