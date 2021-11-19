import contextMenu from ".";

export default function (app: Electron.App) {
  app.on("web-contents-created", (e, contents) => {
    if (contents.getType() == "webview") {
      // set context menu in
      contextMenu({ window: contents });
    }
  });
}
