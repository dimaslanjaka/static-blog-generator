# Sitemap Crawler (Monorepo Package)
Generate sitemap just throw any link.

## Intro
``sitemap-crawler`` collect directly accessible url through resolve with href value.

## Installation
```bash
npm install https://github.com/dimaslanjaka/static-blog-generator-hexo/raw/master/packages/sitemap-crawler/release/sitemap-crawler.tgz
```

## Update
```bash
npm update sitemap-crawler
```

## Basic Usage
```js
const siteMap = require('sitemap-crawler');
const link = 'http://www.npmjs.com';

siteMap(link, {}, (err, res) => {
  console.log('error:', err);
  console.log('siteMap:', res); // Print the siteMap from link
});
```
**Result**
```json
[
  "https://npmjs.com/features",
  "https://npmjs.com/pricing",
  "https://npmjs.com/support",
  "https://npmjs.com/signup",
  "https://npmjs.com/signup?next=/org/create",
  "https://npmjs.com/get-npm",
  "https://npmjs.com/enterprise"
]
```

## Plural Link
You can crawl from string array that includes link.

In this case, crawler response **object** type.
```js
const siteMap = require('sitemap-crawler');
const links = [
  'http://www.npmjs.com',
  'http://github.com',
  'www.amazon.com'
]

siteMap(links, {}, (err, res) => {
  console.log('error:', err);
  console.log('siteMap:', res); // Print the siteMap from link
});
```

**Result**
```json
{
  "count": 3,
  "siteMap": {
    "http://www.npmjs.com": [...],
    "http://www.amazon.com": [...],
    "http://github.com": [...]
  }
}
```

## Async with depth crawler
```js
const siteMap = require('sitemap-crawler').sitemapCrawlerAsync;
const links = [
  'http://www.npmjs.com',
  'http://github.com',
  'www.amazon.com'
]
// crawl site with depth 2
siteMap(links, { deep: 2 }, (err, res) => {
  console.log('error:', err);
  console.log('siteMap:', res); // Print the siteMap from link
});
```

## Options
You can use prepared options.
- ``isProgress`` ``Boolean`` : If true, show CLI Progress while crawl.
- ``isLog`` ``Boolean`` : If true, print request error log.
```js
const siteMap = require('sitemap-crawler');
const link = 'http://www.npmjs.com';

siteMap(link, {isProgress : true, isLog : true}, (err, res) => {
  console.log('error:', err);
  console.log('siteMap:', res); // Print the siteMap from link
});
```

## Authors
tinyjin - [Github](https:github.com/tinyjin), [Blog](https://wlsdml1103.blog.me)

## Contributors
dimaslanjaka - [Github](https:github.com/dimaslanjaka), [Blog](https://webmanajemen.com)

## License
This project has MIT License.
