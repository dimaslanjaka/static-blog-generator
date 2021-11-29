const proxyGrabber = require('.');
const dbProxy = require('.').db;
const path = require('path');
const gulp = require('gulp');

function testProxy(done) {
  const grabber = new proxyGrabber();
  grabber.test();
  done();
}

function testDB(done) {
  /**
   * @type {import('./src/db/construct')}
   */
  const db = new dbProxy(path.join(__dirname, 'databases'));
  if (!db.exists('/test')) {
    db.push('/test/string', 'string db');
    db.push('/test/number', parseInt(Math.random()));
    db.push('/test/float', parseFloat(Math.random()));
    db.push('/test/object', { key: 'value' });
    db.push('/test/array', ['satu', 'dua', 'tiga']);
    db.push('/test/arrayOfObjects', [{ key: 'value' }, { key: 'value2' }, { key: 'value3' }]);
  }

  console.log(
    db.get('/test/array'),
    db.get('/test/object'),
    db.get('/test/number'),
    db.get('/test/float'),
    db.get('/test/string'),
  );

  db.edit('/test/arrayOfObjects', { key: 'value', newKey: Math.random().toFixed(2) }, { key: 'value' });
  console.log(db.get('/test/arrayOfObjects'));

  done();
}

exports.db = testDB;
exports.proxy = testProxy;
exports.default = gulp.series(testDB, testProxy);
