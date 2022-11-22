import fs from 'fs';
import { join } from 'path';
import { sitemapCrawlerAsync } from '../src';

const links = [
  'https://www.webmanajemen.com/chimeraland',
  'https://www.webmanajemen.com',
  'https://web-manajemen.blogspot.com'
];
sitemapCrawlerAsync(links, {
  isProgress: true,
  isLog: true,
  deep: 1
}).then((results) => {
  if (!fs.existsSync(join(__dirname, '../tmp'))) fs.mkdirSync(join(__dirname, '../tmp'));
  fs.writeFileSync(join(__dirname, '../tmp/asynchronous.json'), JSON.stringify(results, null, 2));
  console.log('finish', join(__dirname, '../tmp/asynchronous.json'));
});
