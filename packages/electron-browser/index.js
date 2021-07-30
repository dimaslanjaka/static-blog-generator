/*
const isDev = process.env.ENV ? process.env.ENV.trim() === "true" : false;
const path = require("path");
if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron.cmd"),
  });
}
 */
require("./build/index");
