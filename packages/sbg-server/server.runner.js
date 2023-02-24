process.cwd = () => __dirname + '/../../test';
const { default: axios } = require('axios');
const { pathJoin } = require('sbg-utility');

// dev server
// just test unit
// not for compile

/**
 * server runner
 * @param {import('./src').default} SBGServer choose from dev or dist
 */
function server_runner(SBGServer) {
  const _server = new SBGServer({
    port: 4000,
    root: pathJoin(__dirname, '../../test'),
    cache: false
  });
  const app = _server.startExpress();
  app.get('/session-test', function (req, res) {
    if (req.session.views) {
      req.session.views++;
      res.setHeader('Content-Type', 'text/html');
      res.write('<p>views: ' + req.session.views + '</p>');
      res.end();
    } else {
      req.session.views = 1;
      res.end('Welcome to the file session demo. Refresh page!');
    }
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
