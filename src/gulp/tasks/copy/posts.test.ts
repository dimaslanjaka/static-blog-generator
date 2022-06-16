import { existsSync } from 'fs';
import { copyPosts } from './posts';

//copyPosts(null, 'src-posts/Tests/unit/elements.md', {cache:false});
copyPosts(null, 'folder with space/file post with space.md', {
  cache: false
}).each((obj) => {
  console.log(obj.saveTo, existsSync(obj.saveTo));
});
