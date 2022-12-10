require('ts-node/register');

const _use = (flavor) => {
  if (flavor === 'dist') {
    console.log('from dist');
    require('../dist/gulpfile');
    require('../dist');
  } else {
    console.log('from src');
    require('../src/gulpfile');
    require('../src');
  }
};

_use('dist');
