// http://75.119.137.215/drama-korea-the-secret-house-2022
import CryptoJS from 'crypto-js';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as hpost from 'hexo-post-parser';
import moment from 'moment-timezone';
import prettier from 'prettier';
import puppeteer from 'puppeteer';
import slugify from 'slugify';
import path from 'upath';
import { fileURLToPath } from 'url';

const { dirname, join } = path;
const __dirname = dirname(fileURLToPath(import.meta.url));

const basePath = 'http://75.119.137.215';

getContent('http://75.119.137.215/drama-korea-the-secret-house-2022');

async function getContent(url: string) {
  if (typeof url !== 'string' || String(url).trim().length === 0) return;

  const browser = await puppeteer.launch({ headless: true, timeout: 30 * 60 * 1000 });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (request.resourceType() !== 'script') return request.continue();
    //console.log(request.resourceType(), request.url());
    if (request.url().startsWith(basePath)) {
      request.continue();
    } else {
      request.abort();
    }
  });

  await page.goto(url, { waitUntil: 'load', timeout: 0 });

  const resultsSelector = '.gmr-single';

  await page.waitForSelector(resultsSelector);

  const scrapper = await page.evaluate((resultsSelector: string) => {
    // remove unwanted html
    document.querySelector('.social-share-single')?.remove();

    // extract contents
    const content = Array.from(document.querySelectorAll(resultsSelector)).map((anchor) => {
      return anchor.innerHTML.replace('KAWANFILM21', 'WMI').trim();
    });
    const title = document.title
      .replace(/-\s+KAWANFILM21/gm, '')
      .replace(/nonton film/i, 'Download')
      .trim();
    const date = document.querySelector('meta[property="article:published_time"]')?.getAttribute('content').trim();
    const thumbnail = document.querySelector('.attachment-thumbnail')?.getAttribute('src');

    return { content, title, date, thumbnail };
  }, resultsSelector);

  //console.log(scrapper.content.join('\n').trim(), scrapper.title);

  if (scrapper.title) {
    const date = String(scrapper.date);
    const permalink =
      moment(date).format('YYYY') +
      '/' +
      moment(date).format('MM') +
      '/' +
      slugify(scrapper.title, {
        lower: true,
        trim: true,
        strict: true,
        replacement: '-'
      }) +
      '.html';
    const metadata = {
      title: scrapper.title,
      date,
      updated: moment().format(),
      thumbnail: String(scrapper.thumbnail),
      permalink
    };

    const build = hpost.buildPost({
      metadata,
      body: prettier.format(scrapper.content.join('\n').trim(), { parser: 'html' })
    });

    //const saveTo = join(__dirname, '../../../src-posts/scrapped', postfilename);
    const saveTo = join(__dirname, '../../../src-posts/scrapped', CryptoJS.MD5(url).toString() + '.md');
    if (!existsSync(dirname(saveTo))) mkdirSync(dirname(saveTo), { recursive: true });
    writeFileSync(saveTo, build);
    console.log(saveTo);
  }

  await browser.close();
}
