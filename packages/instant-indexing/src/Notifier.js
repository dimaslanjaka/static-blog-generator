const { google } = require('googleapis');
const request = require('request');

class Notifier {
  /**
   * @type {import('googleapis').Auth.JWT}
   */
  jwtClient;
  constructor(key) {
    this.jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/indexing'],
      null
    );
  }

  /**
   * Single notify
   * @param {string} url
   * @param {"create"|"update"|"delete"} type
   */
  single(url, type) {
    this.jwtClient.authorize(function (err, tokens) {
      if (err) {
        console.log(err);
        return;
      }
      let notifyType;
      switch (type) {
        case 'update':
        case 'create':
          notifyType = 'URL_UPDATED';
          break;
        case 'delete':
          notifyType = 'URL_DELETED';
          break;
        default:
          notifyType = 'URL_UPDATED';
          break;
      }
      let options = {
        url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
        method: 'POST',
        // Your options, which must include the Content-Type and auth headers
        headers: {
          'Content-Type': 'application/json'
        },
        auth: { bearer: tokens.access_token },
        // Define contents here. The structure of the content is described in the next step.
        json: {
          url: url,
          type: notifyType
        }
      };
      request(options, function (error, _response, body) {
        if (!error) {
          console.log(body);
        }
      });
    });
  }

  /**
   * Batch notify
   * @param {string[]} list
   */
  batch(list) {
    const items = list.map((line) => {
      return {
        'Content-Type': 'application/http',
        'Content-ID': '',
        body:
          'POST /v3/urlNotifications:publish HTTP/1.1\n' +
          'Content-Type: application/json\n\n' +
          JSON.stringify({
            url: line,
            type: 'URL_UPDATED'
          })
      };
    });
    const options = {
      url: 'https://indexing.googleapis.com/batch',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/mixed'
      },
      auth: { bearer: tokens.access_token },
      multipart: items
    };
    request(options, (err, _resp, body) => {
      if (!err) {
        console.log(body);
      }
    });
  }
}

module.exports = Notifier;
