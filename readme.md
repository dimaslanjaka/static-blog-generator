# SBG (Static Blog Generator) NodeJS Project
NodeJS Static Blog Generator Inspired Idea From HexoJS. Because of HexoJS doesn't support 1000 posts on 8GB RAM device, i creating this project.

<details>
  <summary>Walkthrough</summary>

  ## Project Walkthrough
  - I switched platforms from blogger to github page.
  ![image](https://user-images.githubusercontent.com/12471057/162500759-7bf0931e-ea5c-4925-b1cb-1653c9ba00bc.png)
  - Using HexoJS for first time, and creating my own platform converter `Blogger to HexoJS` https://github.com/dimaslanjaka/hexo-blogger-xml
  - After a few months, my posts have reached 800. hexojs is starting to become unfriendly, to the point that all my articles are corrupted (not rendered perfectly). And some posts got reduced from page rank.
  - And i got confused, then iam creating this project
</details>

## project information
[![webmanajemen.com](https://img.shields.io/website.svg?down_color=red&down_message=down&style=flat-square&up_color=green&up_message=up&label=webmanajemen.com&url=https://webmanajemen.com)](https://webmanajemen.com)
[![Join the chat at https://gitter.im/static-blog-generator/discussions](https://badges.gitter.im/static-blog-generator/discussions.svg)](https://gitter.im/static-blog-generator/discussions?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/static-blog-generator.svg?style=flat-square)](https://badge.fury.io/js/static-blog-generator)
[![Npm package yearly downloads](https://badgen.net/npm/dy/static-blog-generator?style=flat-square)](https://npmjs.com/package/static-blog-generator)
[![Minimum node.js version](https://badgen.net/npm/node/static-blog-generator?style=flat-square)](https://npmjs.com/package/static-blog-generator)
![GitHub repo size](https://img.shields.io/github/repo-size/dimaslanjaka/static-blog-generator?label=Repository%20Size&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/dimaslanjaka/static-blog-generator?color=blue&label=Last%20Commit&style=flat-square)

| Name | URL | Coverage | CI |
| --- | --- | --- | --- |
| Stable | [Download](https://bit.ly/3mnUiZp) | - | - |
| Development | [GitHub](https://github.com/dimaslanjaka/static-blog-generator) | [![DeepScan grade](https://deepscan.io/api/teams/17454/projects/21168/branches/599935/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=17454&pid=21168&bid=599935) | [![Dev Build](https://github.com/dimaslanjaka/static-blog-generator/actions/workflows/dev-build.yml/badge.svg)](https://github.com/dimaslanjaka/static-blog-generator/actions/workflows/dev-build.yml) [![Dev Tests](https://github.com/dimaslanjaka/static-blog-generator/actions/workflows/dev-test.yml/badge.svg)](https://github.com/dimaslanjaka/static-blog-generator/actions/workflows/dev-test.yml) |

Project active and used at [https://github.com/dimaslanjaka/static-blog-generator-hexo](https://github.com/dimaslanjaka/static-blog-generator-hexo) as **Post Processor** and **GitHub Site Deployer**. Site result at https://github.com/dimaslanjaka/dimaslanjaka.github.io

<!--### temporarily disabled
- gulp server : because of major changes, were disabled gulp local server, use php local server instead
-->
## features
- nodejs (12.x - 17.x supported)
- typescript (pure typescript commonjs with esmodule interop project)
- ejs engine (template renderer)
- markdown engine (using markdown-it support footnotes, sup, sub, etc)
- vscode ide integrated settings (development using vscode recommended)
- cache strategies (dont process any unmodified files to save memory usages)
- github pages deployer (merged instead clean old files to syncronize with cache strategy)
- 1000+ posts supported
- cross-platform supported

## Requirements
- linux recommended (used default c++)
- windows need msvs [[read gist](https://gist.github.com/jtrefry/fd0ea70a89e2c3b7779c)]
- android termux need c++
```bash
pkg install clang -y
# or
pkg install g++
```

## Project Installation
Install using `npm` recommended.

```bash
# install global packages
npm i -g npm gulp-cli typescript ts-node
# clone
git clone https://github.com/dimaslanjaka/static-blog-generator.git foldername
# cd
cd foldername
# fetch all submodules
git submodule update --recursive --remote
# delete posts (don't copy my articles)
rm -rf src-posts/*
# create required folder
mkdir tmp themes
# install dependencies
npm install
```

**installing development**
```bash
npm i -D https://github.com/dimaslanjaka/static-blog-generator/raw/master/release/development.tgz
```

## project structure

| folder name | description |
| :--- | :--- |
| `src-posts` | contains all original posts with markdown formats (ejs shortcodes supported) |
| `source` | (`config.source_dir` in [_config.yml](https://github.com/dimaslanjaka/static-blog-generator/blob/d951721d632c720727db718fd481e532c2e493f1/_config.yml#L28-L38)) contains all pages that should be on public directory (`config.public_dir` in [_config.yml](https://github.com/dimaslanjaka/static-blog-generator/blob/d951721d632c720727db718fd481e532c2e493f1/_config.yml#L28-L38)) |
| `node_modules/.cache/dimaslanjaka` | database caches |

## Project Configuration
[View Full Documentation](https://github.com/dimaslanjaka/static-blog-generator/blob/master/readme-options.md)

## command line
[See Documentation static-blog-generator CLI](https://github.com/dimaslanjaka/static-blog-generator/blob/master/src/bin/sbg.md)

## Github Action
~important: always run `gulp clean` to prevent deleted files on origin repository **https://github.com/JamesIves/github-pages-deploy-action/discussions/1070**~

## PHP Local Server
- https://askubuntu.com/questions/64095/change-xampps-htdocs-web-root-folder-to-another-one
- https://stackoverflow.com/questions/7337724/how-to-check-whether-mod-rewrite-is-enable-on-server
- https://stackoverflow.com/questions/10878284/virtual-hosts-xampp-linux-ubuntu-not-working

## References
- https://stackoverflow.com/questions/2862590/how-to-replace-master-branch-in-git-entirely-from-another-branch

## Troubleshoot
- css and js files not found
> bypass using `.nojekyll`
> It is now possible to completely bypass Jekyll processing on GitHub Pages by creating a file named `.nojekyll` in the root of your pages repo and pushing it to GitHub. This should only be necessary if your site uses files or directories that start with underscores since Jekyll considers these to be special resources and does not copy them to the final site.

## todo
- [ ] admin panel
- [ ] download external images to local
- [ ] GUI
- [x] template
- [x] archives generator
- [x] multiple type of sitemap (google news, sitemap text, sitemap html, sitemap xml)

## contacts
- dimaslanjaka@gmail.com
- whatsapp +6285655667573

## incoming terms
- nodejs static blog generator
- nodejs termux static blog generator
- nodejs simple static blog generator

## Other Packages

### hexo-post-parser
[![npm version](https://badge.fury.io/js/hexo-post-parser.svg?style=flat-square)](https://badge.fury.io/js/hexo-post-parser)
[![Npm package yearly downloads](https://badgen.net/npm/dy/hexo-post-parser?style=flat-square)](https://npmjs.com/package/hexo-post-parser)
[![Minimum node.js version](https://badgen.net/npm/node/hexo-post-parser?style=flat-square)](https://npmjs.com/package/hexo-post-parser)
![GitHub repo size](https://img.shields.io/github/repo-size/dimaslanjaka/hexo-post-parser?label=Repository%20Size&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/dimaslanjaka/hexo-post-parser?color=blue&label=Last%20Commit&style=flat-square)

### google-news-sitemap
[![npm version](https://badge.fury.io/js/google-news-sitemap.svg?style=flat-square)](https://badge.fury.io/js/google-news-sitemap)
[![Npm package yearly downloads](https://badgen.net/npm/dy/google-news-sitemap?style=flat-square)](https://npmjs.com/package/google-news-sitemap)
[![Minimum node.js version](https://badgen.net/npm/node/google-news-sitemap?style=flat-square)](https://npmjs.com/package/google-news-sitemap)
![GitHub repo size](https://img.shields.io/github/repo-size/dimaslanjaka/google-news-sitemap?label=Repository%20Size&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/dimaslanjaka/google-news-sitemap?color=blue&label=Last%20Commit&style=flat-square)

### hexo-adsense
[![npm version](https://badge.fury.io/js/hexo-adsense.svg?style=flat-square)](https://badge.fury.io/js/hexo-adsense)
[![Npm package yearly downloads](https://badgen.net/npm/dy/hexo-adsense?style=flat-square)](https://npmjs.com/package/hexo-adsense)
[![Minimum node.js version](https://badgen.net/npm/node/hexo-adsense?style=flat-square)](https://npmjs.com/package/hexo-adsense)
![GitHub repo size](https://img.shields.io/github/repo-size/dimaslanjaka/hexo-adsense?label=Repository%20Size&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/dimaslanjaka/hexo-adsense?color=blue&label=Last%20Commit&style=flat-square)

### hexo-seo
[![npm version](https://badge.fury.io/js/hexo-seo.svg?style=flat-square)](https://badge.fury.io/js/hexo-seo)
[![Npm package yearly downloads](https://badgen.net/npm/dy/hexo-seo?style=flat-square)](https://npmjs.com/package/hexo-seo)
[![Minimum node.js version](https://badgen.net/npm/node/hexo-seo?style=flat-square)](https://npmjs.com/package/hexo-seo)
![GitHub repo size](https://img.shields.io/github/repo-size/dimaslanjaka/hexo-seo?label=Repository%20Size&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/dimaslanjaka/hexo-seo?color=blue&label=Last%20Commit&style=flat-square)

### hexo-blogger-xml
[![npm version](https://badge.fury.io/js/hexo-blogger-xml.svg?style=flat-square)](https://badge.fury.io/js/hexo-blogger-xml)
[![Npm package yearly downloads](https://badgen.net/npm/dy/hexo-blogger-xml?style=flat-square)](https://npmjs.com/package/hexo-blogger-xml)
[![Minimum node.js version](https://badgen.net/npm/node/hexo-blogger-xml?style=flat-square)](https://npmjs.com/package/hexo-blogger-xml)
![GitHub repo size](https://img.shields.io/github/repo-size/dimaslanjaka/hexo-blogger-xml?label=Repository%20Size&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/dimaslanjaka/hexo-blogger-xml?color=blue&label=Last%20Commit&style=flat-square)
