"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sitemap_1 = require("../src/sitemap");
const links = ['https://www.webmanajemen.com'];
const opts = {
    isProgress: true,
    isLog: true
};
(0, sitemap_1.sitemapAsync)(links, opts).then(console.log);
