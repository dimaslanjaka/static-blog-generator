require('dotenv').config();
const { pathJoin } = require('sbg-utility');
const { SBGServer } = require('./dist/server');

// dev server
// just test unit
// not for compile

const _server = new SBGServer({
  port: 4000,
  root: pathJoin(__dirname, '../../test')
});
_server.start();
