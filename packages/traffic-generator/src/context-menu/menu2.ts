import contextMenu from ".";

export default function (app: Electron.App) {
  // create context menu in main window
  contextMenu();
  app.on("web-contents-created", (e, contents) => {
    if (contents.getType() == "webview") {
      // set context menu in webviews
      contextMenu({ window: contents });
    }
  });
}
