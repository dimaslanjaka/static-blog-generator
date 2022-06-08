import { copyAssets } from './assets';

copyAssets(['shortcode']).then((copied) => {
  console.log(copied);
});
