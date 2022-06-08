import MeasureTime from './measure-timing';

const measure = new MeasureTime();

function nonAsync() {
  return '';
}

async function theAsync() {
  return '';
}

measure
  .run('non-async', nonAsync)
  .then((ins) => ins.run('run-async', theAsync));
