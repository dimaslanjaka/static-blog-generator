import { Menu, MenuItem } from "electron";
import contextMenu from ".";

const menu = new Menu();

//Basic Menu For Testing
menu.append(
  new MenuItem({
    label: "MenuItem1",
    click: function () {
      console.log("YES");
    }
  })
);
menu.append(new MenuItem({ type: "separator" }));
menu.append(
  new MenuItem({ label: "MenuItem2", type: "checkbox", checked: true })
);

export default function (app: Electron.App) {
  app.on("web-contents-created", (e, contents) => {
    if (contents.getType() == "webview") {
      // set context menu in webview
      contextMenu({ window: contents });
    }
  });
}
