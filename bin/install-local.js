const spawnerBin = require('./spawner-bin');

const commands = `
npm un hexo-post-parser persistent-cache sbg-themes safelinkify
npm i file:../persistent-cache
npm i file:../safelink
npm i file:../hexo-post-parser
npm i file:../persistent-cache
npm i file:../google-news-sitemap
npm install -O file:./themes
node scripts/preinstall.js
`;
spawnerBin(commands);
