process.env.DEBUG = 'sbg-server,sbg-server:*';

///
import path from 'upath';
import SBGServer from './server';
///

// just test unit
// not for compile

const _server = new SBGServer({
  port: 4000,
  root: path.join(__dirname, '../../../test')
});
_server.__dump();
