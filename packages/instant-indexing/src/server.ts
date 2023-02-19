import { google } from 'googleapis';
import { authenticate, scopes } from './oauth2';

main();

const webmasters = google.webmasters('v3');

async function main() {
  const auth = await authenticate(scopes);
  google.options({ auth });
  const res = webmasters.searchanalytics.query({
    siteUrl: 'https://www.webmanajemen.com',
    requestBody: {
      startDate: '2022-01-01',
      endDate: '2023-04-01'
    }
  });
  const { data } = await res;
  console.log(data);
}
