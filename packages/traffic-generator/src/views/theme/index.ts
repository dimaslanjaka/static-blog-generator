import path from "path";
import htmlparser from "node-html-parser";
import { readDir, readFile, writeFile } from "../../../../hexo-seo/src/fm";
import { existsSync, link } from "fs";
import schemaRouteConfig from "../routes/$schema.json";
type typeSchemaRouteConfig = typeof schemaRouteConfig;

export default class Theme {
  index = path.join(__dirname, "index.html");
  dom: ReturnType<typeof htmlparser>;
  scan = false;
  /**
   * Base folder
   */
  base: string;
  constructor(base: string) {
    this.base = base;
    if (this.scan) {
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
            //console.log(route);
          }
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

    // define root content
    const root = this.dom.querySelector("#root");

    // define js files
    const js = this.dom.querySelector("script#js-custom");
    const assetJs = path.join(this.base, routePath + ".js");
    if (existsSync(assetJs)) {
      js.setAttribute("src", assetJs);
    } else {
      js.remove();
    }

    // define css files
    const css = this.dom.querySelector("link#css-custom");
    const assetCss = path.join(this.base, routePath + ".css");
    if (existsSync(assetCss)) {
      css.setAttribute("href", assetCss);
    } else {
      css.remove();
    }

    // append root with content
    const assetHtml = path.join(this.base, routePath + ".html");
    if (existsSync(assetHtml)) {
      root.set_content(readFile(assetHtml).toString());
    } else {
      root.set_content(`${assetHtml} not found`);
    }

    // set internal page as new window
    const links = this.dom.querySelectorAll("a"); // as NodeListOf<HTMLAnchorElement>
    links.forEach((a) => {
      const href = a.getAttribute("href");
      if (!/^https?:\/\//g.test(href)) {
        a.setAttribute("new-window", "true");
      }
    });
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
