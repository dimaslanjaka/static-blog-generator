import path from "path";
import htmlparser from "node-html-parser";
import { readDir, readFile, writeFile } from "../../../../hexo-seo/src/fm";
import { existsSync, link } from "fs";

export default class Theme {
  index = path.join(__dirname, "index.html");
  dom: ReturnType<typeof htmlparser>;
  /**
   * Base folder
   */
  base: string;
  constructor(base: string) {
    this.base = base;
    // read all routes
    const readdir = readDir(base);
    const pathes = readdir
      .filter((file) => {
        return file.endsWith(".html");
      })
      .map((file) => {
        return path.basename(file, ".html");
      });
    if (pathes.length)
      for (const key in pathes) {
        if (Object.prototype.hasOwnProperty.call(pathes, key)) {
          const route = this.route(pathes[key]).getPath();
          console.log(route);
        }
      }
  }
  /**
   * Load index theme for reuse template
   */
  private loadThemeIndex() {
    const read = readFile(this.index);
    this.dom = htmlparser(read.toString());
  }
  /**
   * Generate static files by route path
   * @param routePath
   * @returns
   */
  route(routePath: string) {
    this.loadThemeIndex();
    const js = this.dom.querySelector("script#js-custom");
    const css = this.dom.querySelector("link#css-custom");
    const root = this.dom.querySelector("#root");
    const assetJs = path.join(this.base, routePath + ".js");
    if (existsSync(assetJs)) {
      js.setAttribute("src", assetJs);
    } else {
      js.remove();
    }
    const assetCss = path.join(this.base, routePath + ".css");
    if (existsSync(assetCss)) {
      css.setAttribute("href", assetCss);
    } else {
      css.remove();
    }
    const assetHtml = path.join(this.base, routePath + ".html");
    if (existsSync(assetHtml)) {
      root.set_content(readFile(assetHtml).toString());
    } else {
      root.set_content(`${assetHtml} not found`);
    }
    const self = this;
    /*const links = this.dom.querySelectorAll("a"); // as NodeListOf<HTMLAnchorElement>
    links.forEach((a) => {
      const href = a.getAttribute("href");
      if (!/^https?:\/\//g.test(href)) {
        a.setAttribute("href", self.route(href.replace(".html", "")).getPath());
      }
    });*/
    const writeTo = new Theme.routeResolver(routePath);
    writeFile(writeTo.getPath(), this.dom.toString());
    return writeTo;
  }
  toString() {
    return this.dom.toString();
  }

  static routeResolver = class {
    routePath: string;
    constructor(routePath: string) {
      this.routePath = path.join(__dirname, routePath + ".html");
    }
    /**
     * Get route static file path
     * @param protocol with file:// protocol ?
     * @returns
     */
    getPath(protocol = false) {
      return (protocol ? "file://" : "") + this.routePath;
    }
    toString() {
      return readFile(this.routePath).toString();
    }
  };
}
