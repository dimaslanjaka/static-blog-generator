const fs = require('fs');
const { join } = require('path');
const { default: sitemap } = require('../dist');
const links = ['http://www.amazon.com/', 'https://en.wikipedia.org/'];

const opts = {
  isProgress: true,
  isLog: true
};

sitemap(links, opts, (err, res) => {
  if (!fs.existsSync(join(__dirname, 'tmp'))) fs.mkdirSync(join(__dirname, 'tmp'));
  fs.writeFileSync(join(__dirname, 'tmp/test.json'), JSON.stringify(res, null, 2));
  console.log('finish');
});
