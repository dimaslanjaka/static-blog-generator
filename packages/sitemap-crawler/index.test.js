const siteMap = require('./index');
const links = [
  'http://www.amazon.com/',
  'https://en.wikipedia.org/'
];

const opts = {
  isProgress : true,
  isLog : true
};

siteMap(links, opts, (err, res) => {
  require('fs').writeFileSync('test.json', JSON.stringify(res, null, 2));
  console.log('finish');
});