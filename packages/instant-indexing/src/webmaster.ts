import { google } from 'googleapis';
import { jwtAuthorize } from './oauth2';

const searchconsole = google.searchconsole('v1');

/**
 * fetch site list from search console
 * @returns
 */
export async function getSiteList() {
  const client = await jwtAuthorize();
  google.options({ auth: client });
  const response = await searchconsole.sites.list({});
  return response.data;
}

/**
 * submit sitemap
 * @param siteUrl
 * @param feedpath
 * @returns
 */
export async function submitSitemap(siteUrl: string, feedpath: string) {
  const client = await jwtAuthorize();
  google.options({ auth: client });
  const res = await searchconsole.sitemaps.submit({
    feedpath,
    siteUrl
  });
  return res.data;
}

/**
 * check url already indexed or not from webmaster
 * @param inspectionUrl
 * @param siteUrl
 * @returns
 */
export async function checkIndexed(inspectionUrl: string, siteUrl: string) {
  const client = await jwtAuthorize();
  google.options({ auth: client });
  const resInspectURL = await searchconsole.urlInspection.index.inspect({
    requestBody: {
      inspectionUrl,
      siteUrl,
      languageCode: 'en-US'
      //inspectionUrl: 'https://www.webmanajemen.com/chimeraland/materials/pure-wood-essence.html',
      //siteUrl: 'sc-domain:webmanajemen.com'
    }
  });
  return !resInspectURL.data.inspectionResult?.indexStatusResult?.coverageState?.includes('not indexed');
}

// checkIndexed('https://www.webmanajemen.com/chimeraland/materials/pure-wood-essence.html', 'sc-domain:webmanajemen.com');
