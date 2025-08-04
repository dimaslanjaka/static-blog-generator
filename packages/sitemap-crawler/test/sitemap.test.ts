import fs from 'fs';
import { join } from 'path';
import sitemap, { Opt } from '../src/sitemap';

const links = ['https://www.webmanajemen.com'];
const opts: Opt = {
  isProgress: true,
  isLog: true,
  deep: 2
};

sitemap(links, opts, (err, res) => {
  if (!err) {
    if (!fs.existsSync(join(__dirname, '../tmp'))) fs.mkdirSync(join(__dirname, '../tmp'));
    fs.writeFileSync(join(__dirname, '../tmp/synchronous.json'), JSON.stringify(res, null, 2));
    console.log('finish', join(__dirname, '../tmp/synchronous.json'));
  }
});
