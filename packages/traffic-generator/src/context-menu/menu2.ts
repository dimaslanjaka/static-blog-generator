import contextMenu from ".";

export default function (app: Electron.App) {
  app.on("web-contents-created", (e, contents) => {
    if (contents.getType() == "webview") {
      // set context menu in
      const opt = contextMenu.defaultActions;
      opt.window = contents;
      contextMenu.default(opt);
    }
  });
}
