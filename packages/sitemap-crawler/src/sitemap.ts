import async from 'async';
import cheerio from 'cheerio';
import ProgressBar from 'progress';
import request from 'request';

type cb = (arg0: Error | null, arg1?: any) => void;

class SiteMapCrawler {
  static start(
    links: string[],
    isProgress: any,
    isLog: any,
    isCounting: boolean,
    callback: cb
  ) {
    const siteMap: Record<string, any> = {};
    let bar: ProgressBar;

    if (isProgress) {
      bar = new ProgressBar('siteMap-crawling [:bar] :percent', {
        total: links.length
      });
    }

    async.each(
      links,
      (link, callback) => {
        const done = () => {
          if (isProgress) {
            bar.tick();
          }

          callback();
        };

        request(link, (err, res, body) => {
          if (err) {
            if (isLog) {
              const { errno, code, syscall, host } = err;
              console.log(`\nError: ${errno} ${code} ${syscall}, ${host}`);
            }
            return done();
          }

          const $ = cheerio.load(body);
          const hrefs = $('[href]');
          const filteredLinks = new Set<string>();

          hrefs.each((i) => {
            const href = this.filterLink(
              link,
              hrefs.eq(i).attr('href') || ''
            )?.trim();

            if (typeof href === 'string' && href.length > 0) {
              filteredLinks.add(href);
            }
          });

          const arrayLinks = Array.from(filteredLinks).map((url) => {
            if (url.endsWith('/')) url += 'index.html';
          });

          if (arrayLinks.length > 0) {
            siteMap[link] = arrayLinks;
          }
          return done();
        });
      },
      (err) => {
        if (err) {
          return callback(err);
        }

        const count = Object.keys(siteMap).length;
        const siteMapObj = isCounting
          ? { count, siteMap }
          : siteMap[<any>links];

        callback(null, siteMapObj);
      }
    );
  }

  static filterLink(parent: string, href: string) {
    const ignores = [
      '^javascript',
      'css',
      'ico',
      '#',
      '^/$',
      '^#none$',
      '^$',
      '@',
      'png',
      'pdf$',
      '^tel',
      '^sms',
      '^mailto',
      'admin',
      'login',
      'register'
    ];
    const rIgnores = new RegExp(ignores.join('|'), 'i');

    if (isValidHttpUrl(href)) {
      const parentHostName = new URL(parent).hostname;
      const hrefHostName = new URL(href).hostname;

      if (parentHostName === hrefHostName && !href.match(rIgnores)) {
        return href;
      }
    }

    if (!href.match(rIgnores) && !href.includes('//')) {
      const resolvedUrl = String(new URL(parent + href));
      //console.log(parent, href, resolvedUrl);
      return resolvedUrl;
    }

    return null;
  }
}

const attachProtocol = (link: string) => {
  if (!link.startsWith('http')) {
    return 'http://' + link;
  }

  return link;
};

const siteMap = (
  link: string | string[],
  opts = { isProgress: false, isLog: false },
  callback?: cb
) => {
  let isProgress = false,
    isLog = false,
    isCounting = true;

  if (typeof opts === 'function') {
    callback = opts;
  } else {
    isProgress = opts.isProgress || false;
    isLog = opts.isLog || false;
  }

  if (typeof link === 'string') {
    link = attachProtocol(link);
    link = [link];
    isCounting = false;
  } else {
    link = link.map((l) => {
      return attachProtocol(l);
    });
  }

  SiteMapCrawler.start(link, isProgress, isLog, isCounting, callback || noop);
};

export default siteMap;

function noop() {
  //
}

function isValidHttpUrl(string: string | URL) {
  let url: URL;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}
