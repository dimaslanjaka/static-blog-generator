process.cwd = () => __dirname + '/../../test';
const { default: axios } = require('axios');
const { pathJoin, jsonStringifyWithCircularRefs } = require('sbg-utility');

// dev server
// just test unit
// not for compile

/**
 * server runner
 * @param {typeof import('./src').SBGServer} SBGServer choose from dev or dist
 */
function server_runner(SBGServer) {
  const _server = new SBGServer({
    port: 4000,
    root: pathJoin(__dirname, '../../test'),
    cache: false
  });
  const app = _server.startExpress();
  app.get('/test/view', function (req, res) {
    if (typeof req.session.views === 'number') {
      req.session.views++;
      res.setHeader('Content-Type', 'text/html');
      res.write('<p>views: ' + req.session.views + '</p>');
      res.end();
    } else {
      req.session.views = 0;
      res.end('Welcome to the file session demo. Refresh page!');
    }
  });
  app.get('/test/headers', function (req, res) {
    // res.setHeader('content-type', 'application/json; charset=utf-8');
    const json = jsonStringifyWithCircularRefs(req.headers);
    // res.send(json);
    res.json(json);
  });
  _server.start(app).once('listening', function () {
    console.log('check connection');
    axios
      .get('http://localhost:4000/post/json')
      .then(() => console.log('check connection success'))
      .catch(() => console.log('check connection failed'));
  });
}

module.exports = { server_runner };
