import async from 'async';
import Bluebird from 'bluebird';
import cheerio from 'cheerio';
import ProgressBar from 'progress';
import request from 'request';

type cb = (arg0: Error | null, arg1?: string[]) => void;

export interface Opt {
  isProgress?: boolean;
  isLog?: boolean;
  /**
   * keep query url ?key=value
   */
  keepQuery?: boolean;
}

export class SiteMapCrawlerCore {
  static start(
    links: string[],
    core_opt: Opt,
    isCounting: boolean,
    callback: cb
  ) {
    const { isProgress, isLog } = core_opt;
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
              const dirUrl = link.substring(0, link.lastIndexOf('/'));
              if (/^https?:\/\//i.test(href.trim())) {
                filteredLinks.add(href);
              } else {
                filteredLinks.add(dirUrl + '/' + href);
              }
            }
          });

          const arrayLinks = Array.from(filteredLinks).map((url) => {
            if (url.endsWith('/')) {
              // url ends with. / -> /index.html
              url += 'index.html';
            } else if (!/(\w+\.\w+)$/.test(url)) {
              // url doesnt have extension. /path -> /path/index.html
              url += '/index.html';
            }
            if (!core_opt.keepQuery) return url.split('?')[0];
            return url;
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
      'svg',
      'manifest.json',
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
      const base = new URL(parent);
      const resolvedUrl = fixUrl([
        String(new URL(base.origin + '/' + href))
      ])[0];
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

export const sitemapCrawler = (
  link: string | string[],
  opts?: Opt,
  callback?: cb
) => {
  let isProgress = false,
    isLog = false,
    isCounting = true;
  opts = Object.assign({ isProgress: false, isLog: false }, opts || {});

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

  SiteMapCrawlerCore.start(
    link,
    {
      isProgress,
      isLog
    },
    isCounting,
    callback || noop
  );
};

export interface SitemapAsyncOpt extends Opt {
  /**
   * Crawl internal links [n] times
   * * **WARNING** dont put `Infinite`
   */
  deep?: number | null;
}

const asyncResults: Record<string, string[]> = {};
type resolveAsync = (o: typeof asyncResults) => any;

export function sitemapCrawlerAsync(
  link: string | string[],
  opts?: SitemapAsyncOpt
) {
  return new Bluebird((resolve: resolveAsync) => {
    // assign with default option
    opts = Object.assign(
      { deep: 0, isLog: false, keepQuery: false, isProgress: false },
      opts || {}
    );
    // crawler
    const crawl = (url: string) => {
      return new Bluebird((resolveCrawl: resolveAsync) => {
        sitemapCrawler(url, opts, function (e, links) {
          if (!e) {
            const key = new URL(url).origin;
            // append to asyncResult
            asyncResults[key] = fixUrl(links || []).concat(
              asyncResults[key] || []
            );
          } else {
            console.log('err', e);
          }
          resolveCrawl(asyncResults);
        });
      });
    };

    let linkArr: string[] = [];
    const crawled: string[] = [];
    const schedule = () => {
      return new Bluebird((resolveSchedule) => {
        const url = linkArr.shift() as string;
        if (crawled.includes(url)) return resolveSchedule();
        crawled.push(url);
        crawl(url).then(() => {
          if (linkArr.length > 0) {
            schedule().then(resolveSchedule);
          } else {
            resolveSchedule();
          }
        });
      });
    };

    if (typeof link === 'string') {
      linkArr.push(link);
    } else {
      linkArr = link;
    }

    const deepIterate = () => {
      return new Promise((resolveLoop) => {
        schedule().then(() => {
          if (typeof opts?.deep === 'number') {
            if (opts.deep > 0) {
              opts.deep = opts.deep - 1;
              linkArr = Object.values(asyncResults).flat(1);
              deepIterate().then(resolveLoop);
            } else {
              resolveLoop(null);
            }
          } else {
            resolveLoop(null);
          }
        });
      });
    };

    deepIterate().then(() => {
      Object.keys(asyncResults).forEach((key) => {
        asyncResults[key] = fixUrl(asyncResults[key]);
      });
      resolve(asyncResults);
    });
  });
}

export default sitemapCrawler;

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

function fixUrl(links: string[]) {
  return (
    links
      .map((url) => {
        //const parse = new URL(url);
        //url = parse.toString();
        // remove double slash from pathname
        url = url.replace(/(https?:\/\/)|(\/)+/gim, '$1$2');
        return url;
      })
      // remove duplicated urls
      .filter(function (x, i, a) {
        return a.indexOf(x) === i;
      })
      // sort alphabetically
      .sort(function (a, b) {
        return a === b ? 0 : a < b ? -1 : 1;
      })
  );
}
