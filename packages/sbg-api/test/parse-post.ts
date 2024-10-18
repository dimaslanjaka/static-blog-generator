import { parsePost } from 'hexo-post-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const file = path.join(__dirname, 'fixtures/source-posts/2022/03/list-of-latest-dofollow-blogs.md');
  console.log(file);
  const parse = await parsePost(file, { cache: false });
  console.log(parse);
}

main();
