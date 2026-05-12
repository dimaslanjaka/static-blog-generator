import { describe, expect, it } from '@jest/globals';
import { sitemapCrawler, sitemapCrawlerAsync, SiteMapCrawlerCore } from '../src/sitemap-crawler/sitemap-crawler';

describe('SiteMapCrawlerCore', () => {
  describe('filterLink', () => {
    const parentUrl = 'https://example.com/page';

    it('should filter out javascript links', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, 'javascript:void(0)');
      expect(result).toBeNull();
    });

    it('should filter out hash links', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '#section');
      expect(result).toBeNull();
    });

    it('should filter out mailto links', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, 'mailto:test@example.com');
      expect(result).toBeNull();
    });

    it('should filter out tel links', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, 'tel:+1234567890');
      expect(result).toBeNull();
    });

    it('should filter out sms links', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, 'sms:+1234567890');
      expect(result).toBeNull();
    });

    it('should filter out external domains', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, 'https://external.com/page');
      expect(result).toBeNull();
    });

    it('should accept same domain absolute URLs', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, 'https://example.com/other-page');
      expect(result).toBe('https://example.com/other-page');
    });

    it('should resolve relative URLs', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '/relative-page');
      expect(result).toMatch(/^https:\/\/example\.com.*relative-page/);
    });

    it('should filter out image extensions', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '/image.png');
      expect(result).toBeNull();
    });

    it('should filter out svg files', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '/icon.svg');
      expect(result).toBeNull();
    });

    it('should filter out CSS files', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '/styles.css');
      expect(result).toBeNull();
    });

    it('should filter out ICO files', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '/favicon.ico');
      expect(result).toBeNull();
    });

    it('should filter out PDF files', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '/document.pdf');
      expect(result).toBeNull();
    });

    it('should filter out manifest.json', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '/manifest.json');
      expect(result).toBeNull();
    });

    it('should filter out admin paths', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '/admin/dashboard');
      expect(result).toBeNull();
    });

    it('should filter out login paths', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '/login');
      expect(result).toBeNull();
    });

    it('should filter out register paths', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '/register');
      expect(result).toBeNull();
    });

    it('should filter out empty href', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '');
      expect(result).toBeNull();
    });

    it('should filter out root slash only', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '/');
      expect(result).toBeNull();
    });

    it('should filter out #none', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '#none');
      expect(result).toBeNull();
    });

    it('should filter out @ symbol', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '@');
      expect(result).toBeNull();
    });

    it('should handle relative paths correctly', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, 'relative-path');
      expect(result).toMatch(/^https:\/\/example\.com.*relative-path/);
    });

    it('should handle paths with query parameters', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '/search?q=test');
      expect(result).toMatch(/^https:\/\/example\.com.*search/);
    });

    it('should handle paths with fragments', () => {
      const result = SiteMapCrawlerCore.filterLink(parentUrl, '/page#section');
      expect(result).toBeNull(); // Should be filtered out due to # in ignores
    });
  });
});

describe('Real Website Crawling', () => {
  const targetUrl = 'https://www.webmanajemen.com/';

  // Increase timeout for real network requests
  const timeout = 30000;

  describe('sitemapCrawler', () => {
    it(
      'should crawl real website and return links',
      (done) => {
        sitemapCrawler(targetUrl, { isProgress: false, isLog: true }, (err, result) => {
          expect(err).toBeNull();
          expect(result).toBeDefined();

          if (Array.isArray(result)) {
            expect(result.length).toBeGreaterThan(0);
            console.log(`Found ${result.length} links on ${targetUrl}`);

            // Verify that all returned links are valid URLs
            result.forEach((link: string) => {
              expect(typeof link).toBe('string');
              expect(link).toMatch(/^https?:\/\//);
            });

            // Log first few links for inspection
            console.log('Sample links found:', result.slice(0, 5));
          }

          done();
        });
      },
      timeout
    );

    it(
      'should handle options correctly',
      (done) => {
        sitemapCrawler(
          targetUrl,
          {
            isProgress: false,
            isLog: false,
            keepQuery: true
          },
          (err, result) => {
            expect(err).toBeNull();
            expect(result).toBeDefined();
            done();
          }
        );
      },
      timeout
    );
  });

  describe('sitemapCrawlerAsync', () => {
    it(
      'should crawl real website asynchronously',
      async () => {
        const result = await sitemapCrawlerAsync(targetUrl, {
          deep: 0,
          isLog: false,
          keepQuery: false,
          isProgress: false
        });

        expect(result).toBeDefined();
        expect(typeof result).toBe('object');

        const origin = new URL(targetUrl).origin;
        expect(result[origin]).toBeDefined();

        if (result[origin] && Array.isArray(result[origin])) {
          expect(result[origin].length).toBeGreaterThan(0);
          console.log(`Async crawler found ${result[origin].length} links`);

          // Verify links are properly formatted
          result[origin].forEach((link: string) => {
            expect(typeof link).toBe('string');
            expect(link).toMatch(/^https?:\/\//);
          });
        }
      },
      timeout
    );

    it(
      'should handle deep crawling with limit',
      async () => {
        const result = await sitemapCrawlerAsync(targetUrl, {
          deep: 1,
          isLog: false,
          keepQuery: false,
          isProgress: false
        });

        expect(result).toBeDefined();
        expect(typeof result).toBe('object');

        // Should have at least the original domain
        const keys = Object.keys(result);
        expect(keys.length).toBeGreaterThanOrEqual(1);

        console.log(`Deep crawling found ${keys.length} different origins`);
      },
      timeout * 2
    ); // Double timeout for deep crawling
  });

  describe('Link Quality Tests', () => {
    it(
      'should return properly formatted URLs',
      (done) => {
        sitemapCrawler(targetUrl, { isLog: false }, (err, result) => {
          expect(err).toBeNull();

          if (Array.isArray(result) && result.length > 0) {
            result.forEach((link: string) => {
              // Should be valid URL
              expect(() => new URL(link)).not.toThrow();

              // Should not contain double slashes (except after protocol)
              const pathPart = link.replace(/^https?:\/\/[^/]+/, '');
              expect(pathPart).not.toMatch(/\/\//);

              // Should not contain fragment identifiers (filtered by default)
              expect(link).not.toMatch(/#/);
            });
          }

          done();
        });
      },
      timeout
    );

    it(
      'should filter out unwanted file types',
      (done) => {
        sitemapCrawler(targetUrl, { isLog: false }, (err, result) => {
          expect(err).toBeNull();

          if (Array.isArray(result)) {
            result.forEach((link: string) => {
              // Should not contain filtered extensions
              expect(link).not.toMatch(/\.(css|js|png|jpg|jpeg|gif|svg|ico|pdf)$/i);

              // Should not contain filtered protocols
              expect(link).not.toMatch(/^(javascript|mailto|tel|sms):/);
            });
          }

          done();
        });
      },
      timeout
    );
  });
});
