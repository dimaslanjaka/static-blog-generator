import * as wildcards from '../src/index.js';

const keys = 'chain, debug, getChecksum, folder_to_hash, md5File, md5FileSync, url_to_hash'
  .split(',')
  .map((k) => k.trim());
keys.forEach((key: string) => {
  if (key in wildcards) {
    console.log(`✅ ${key} is exported`);
  } else {
    console.error(`❌ ${key} is NOT exported`);
  }
});
