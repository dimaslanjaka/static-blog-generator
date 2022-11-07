var google = require('googleapis').google;
var request = require('request');
var Notifier = /** @class */ (function () {
    /**
     *
     * @param {import('./globals').Key} key
     */
    function Notifier(key) {
        this.jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, ['https://www.googleapis.com/auth/indexing'], null);
    }
    /**
     * Single notify
     * @param {string} url
     * @param {"create"|"update"|"delete"} type
     */
    Notifier.prototype.single = function (url, type) {
        this.jwtClient.authorize(function (err, tokens) {
            if (err) {
                console.log(err);
                return;
            }
            var notifyType;
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
            var options = {
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
    };
    /**
     * Batch notify
     * @param {string[]} list
     */
    Notifier.prototype.batch = function (list) {
        var items = list.map(function (line) {
            return {
                'Content-Type': 'application/http',
                'Content-ID': '',
                body: 'POST /v3/urlNotifications:publish HTTP/1.1\n' +
                    'Content-Type: application/json\n\n' +
                    JSON.stringify({
                        url: line,
                        type: 'URL_UPDATED'
                    })
            };
        });
        var options = {
            url: 'https://indexing.googleapis.com/batch',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/mixed'
            },
            auth: { bearer: tokens.access_token },
            multipart: items
        };
        request(options, function (err, _resp, body) {
            if (!err) {
                console.log(body);
            }
        });
    };
    return Notifier;
}());
module.exports = Notifier;
