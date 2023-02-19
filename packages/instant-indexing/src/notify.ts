import axios from 'axios';
import request from 'request';

// https://developers.google.com/search/apis/indexing-api/v3/using-api
// https://github.com/m3m3nto/giaa/blob/master/modules/indexer.js

export function notify(url: string, type: string, tokens: import('googleapis').Auth.Credentials) {
  return new Promise((resolve, reject) => {
    const options = {
      url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      auth: {
        bearer: tokens.access_token
      },
      json: {
        url: url,
        type: type
      }
    };

    request(options, function (error, response, body) {
      if (error) {
        reject(body);
      }
      resolve(body);
    });
  });
}

export async function notify2(
  url: string,
  type: 'URL_UPDATED' | 'URL_DELETED',
  tokens: import('googleapis').Auth.Credentials
) {
  const options = {
    url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.access_token}`
    },
    data: {
      url: url,
      type: type
    }
  };
  const response = await axios(options);
  console.log(response.data);
}
