"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const node_html_parser_1 = __importDefault(require("node-html-parser"));
const fm_1 = require("../../../../hexo-seo/src/fm");
const fs_1 = require("fs");
class Theme {
    constructor(base) {
        this.index = path_1.default.join(__dirname, "index.html");
        this.scan = false;
        this.base = base;
        if (this.scan) {
            // read all routes
            const readdir = (0, fm_1.readDir)(base);
            const pathes = readdir
                .filter((file) => {
                return file.endsWith(".html");
            })
                .map((file) => {
                return path_1.default.basename(file, ".html");
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
    loadThemeIndex() {
        const read = (0, fm_1.readFile)(this.index);
        this.dom = (0, node_html_parser_1.default)(read.toString());
    }
    /**
     * Get resources of route path
     * @param routePath
     * @returns
     */
    getSource(routePath) {
        return {
            js: path_1.default.join(this.base, routePath + ".js"),
            css: path_1.default.join(this.base, routePath + ".css"),
            html: path_1.default.join(this.base, routePath + ".html")
        };
    }
    /**
     * Generate static files by route path
     * @param routePath
     * @returns
     */
    route(routePath) {
        this.loadThemeIndex();
        // define root content
        const root = this.dom.querySelector("#root");
        // define js files
        const js = this.dom.querySelector("script#js-custom");
        const assetJs = path_1.default.join(this.base, routePath + ".js");
        if ((0, fs_1.existsSync)(assetJs)) {
            js.setAttribute("src", assetJs);
        }
        else {
            js.remove();
        }
        // define css files
        const css = this.dom.querySelector("link#css-custom");
        const assetCss = path_1.default.join(this.base, routePath + ".css");
        if ((0, fs_1.existsSync)(assetCss)) {
            css.setAttribute("href", assetCss);
        }
        else {
            css.remove();
        }
        // append root with content
        const assetHtml = path_1.default.join(this.base, routePath + ".html");
        if ((0, fs_1.existsSync)(assetHtml)) {
            root.set_content((0, fm_1.readFile)(assetHtml).toString());
        }
        else {
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
        // write to __dirname/route/path/name.html
        const writeTo = new Theme.routeResolver(routePath);
        (0, fm_1.writeFile)(writeTo.getPath(), this.dom.toString());
        return writeTo;
    }
    toString() {
        return this.dom.toString();
    }
}
exports.default = Theme;
Theme.routeResolver = class {
    constructor(routePath) {
        this.routePath = path_1.default.join(__dirname, routePath + ".html");
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
        return (0, fm_1.readFile)(this.routePath).toString();
    }
};
//# sourceMappingURL=index.js.map