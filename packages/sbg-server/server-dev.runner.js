require('dotenv').config();
require('ts-node').register({ projectSearchDir: __dirname });

process.cwd = () => __dirname + '/../../test';
const { pathJoin } = require('sbg-utility');
const { SBGServer } = require('./src/server');

// dev server
// just test unit
// not for compile

const _server = new SBGServer({
  port: 4000,
  root: pathJoin(__dirname, '../../test')
});
_server.start();
