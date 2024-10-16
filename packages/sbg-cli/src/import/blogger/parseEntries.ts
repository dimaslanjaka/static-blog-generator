import fs from 'fs';
import he from 'he';
import jsonc from 'jsonc-parser';
import { slugify, writefile } from 'sbg-utility';
import path from 'upath';
import { fileURLToPath } from 'url';
import xml2js from 'xml2js';
import { entriesDir } from './config';
import { createEntries } from './createEntries';
// import excludeTitleArr from './excludeTitle.json'; // assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const excludeTitleArr: string[] = jsonc.parse(fs.readFileSync(path.join(__dirname, 'excludeTitle.json')).toString());

export async function parseEntries(c: ReturnType<typeof createEntries>) {
  const feeds = c.document.documentElement.getElementsByTagName('entry');
  for (let index = 0; index < feeds.length; index++) {
    const element = feeds[index];
    let title = element.getElementsByTagName('title')[0].innerHTML;

    const excludeTitle = excludeTitleArr.map((title) => {
      return title.toLowerCase().trim();
    });
    // skip if contains default title
    if (excludeTitle.includes(title.toLowerCase().trim())) continue;

    /** CONTENT PROCESS START **/
    let content = element.getElementsByTagName('content')[0].innerHTML;
    content = he.decode(content);
    /** CONTENT PROCESS END **/

    // write post with decoded entities
    let obj = {
      entry: { content: '', id: [] as string[] }
    };
    //let decodedContent = he.decode(content);
    await new Promise((resolve, reject) => {
      xml2js.parseString(element.outerHTML, function (err, result) {
        if (err) reject(err);
        obj = result;
        // fix title empty (might removed comment)
        if (title.trim().length === 0) {
          title = obj.entry.id[0].replace('tag:blogger.com,1999:', '');
        }
        obj.entry.content = content;
        obj.entry.id[0] = obj.entry.id[0].replace('tag:blogger.com,1999:', '');
        //writeFileSync(path.join(this.entriesDir, sanitize(title) + ".xml"), element.outerHTML);
        writefile(path.join(entriesDir, slugify(title) + '.json'), JSON.stringify(obj, null, 2));
        resolve(null);
      });
    });
  }
  return c;
}
