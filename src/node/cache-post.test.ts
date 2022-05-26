import { join } from 'upath';
import CachePost, {
  getAllPosts,
  getLatestPosts,
  getRandomPosts
} from './cache-post';
import { write } from './filemanager';

const cache = new CachePost();
const all = cache.getAll();
console.log('all total posts', all.length);
write(join(__dirname, 'tmp/all.json'), all);

const all2 = getAllPosts();
console.log('all2 total posts', all2.length);

const random = getRandomPosts(5, 'center');
console.log('random posts', random.length);

const latest = getLatestPosts('-date', 5).map((post) => {
  if (post.body) post.body = 'deleted';
  if (post.content) post.content = 'deleted';
  if (post.config) post.config = {};
  return post;
});
console.log('latest posts', latest.length);
write(join(__dirname, 'tmp/latest.json'), latest);
