import { sitemapAsync } from '../src/sitemap';

const links = ['https://www.webmanajemen.com'];
const opts = {
  isProgress: true,
  isLog: true
};

sitemapAsync(links, opts).then(console.log);
