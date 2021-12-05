// Electron Filemanager
import { app } from "electron";
import path from "path";
import * as fm from "../../../hexo-seo/src/fm";

/**
 * Define resources path
 */
export const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, "assets")
  : path.join(__dirname, "../../assets");

/**
 * get resources path based on {@link RESOURCES_PATH}
 * @param paths
 * @returns
 */
export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === "development") {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, "../views/theme/", htmlFileName)}`;
  };
}
