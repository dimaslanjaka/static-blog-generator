const { writeFileSync } = require('fs');
const md5File = require('md5-file');
const { join } = require('path');
const { spawn } = require('hexo-util');

const hash = md5File.sync(join(__dirname, '../', 'package-lock.json'));
//console.log(`MD5 sum: ${hash}`);
writeFileSync(join(__dirname, '../.guid'), hash);
spawn('git', ['add', '.guid'])
  .then(() =>
    spawn('git', ['commit', '-m', 'update cache ' + new Date()]).catch((e) => {
      if (e instanceof Error) console.log(e.message);
    })
  )
  .catch((e) => {
    if (e instanceof Error) console.log(e.message);
  });
