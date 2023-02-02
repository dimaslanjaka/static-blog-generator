const urllib = require('urllib');
const compressing = require('compressing');

const targetDir = __dirname + '/tmp/test';

urllib
  .request('http://registry.npmjs.org/pedding/-/pedding-1.1.0.tgz', {
    streaming: true,
    followRedirect: true
  })
  .then((result) => compressing.tgz.uncompress(result.res, targetDir, {}))
  .then(() => console.log('uncompress done'))
  .catch(console.error);
