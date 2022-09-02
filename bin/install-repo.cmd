@echo off

npm un hexo-post-parser persistent-cache sbg-themes safelinkify
npm i git+https://github.com/dimaslanjaka/persistent-cache#improve2
npm i git+https://github.com/dimaslanjaka/safelink#master
npm i git+https://github.com/dimaslanjaka/hexo-post-parser#master
npm i git+https://github.com/dimaslanjaka/persistent-cache#improve2
npm i git+https://github.com/dimaslanjaka/google-news-sitemap#master
npm install -O https://github.com/dimaslanjaka/sbg-themes.git
npm i -D git+https://github.com/dimaslanjaka/nodejs-package-types#through2
node scripts/preinstall.js