import axios from '../../node_modules/axios/lib/axios.js';
import Bluebird from 'bluebird';
import { glob } from 'glob';
import Hexo from 'hexo';
import { color, parsePost } from 'hexo-post-parser';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import moment from 'moment-timezone';
import { getConfig, path, writefile } from 'sbg-utility';

/**
 * find broken images from html
 * @param html html string
 * @returns array of broken image url
 */
async function findBrokenImages(html, config = getConfig()) {
    const results = [];
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const images = Array.from(document.querySelectorAll('img'));
    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        let imgUrl;
        if (img.src && img.src.startsWith('http')) {
            imgUrl = img.src;
        }
        else {
            imgUrl = config.url + '/' + img.src;
        }
        await axios.get(imgUrl, { maxRedirects: 3 }).catch((e) => {
            console.error(color.default.redBright('broken image'), img.src, e.message);
            results.push(img.src);
        });
    }
    return results;
}
function hexoFindBrokenImages(done, config = getConfig()) {
    const instance = new Hexo(config.cwd);
    return new Bluebird((resolve) => {
        instance.init().then(() => {
            instance.load().then(() => {
                const postArray = hexo.locals.get('posts').toArray();
                Bluebird.all(postArray)
                    .each(async function (data) {
                    if (data && data.body) {
                        const html = await marked(data.body, { async: true });
                        await findBrokenImages(html);
                    }
                })
                    .catch((e) => console.error('failed find broken images', e));
                resolve(done);
            });
        });
    });
}
/** parse markdown to html */
async function toHtml(file, config = getConfig()) {
    const result = { post: file, brokenImages: [] };
    const parse = await parsePost(file, { sourceFile: file, config });
    if (parse && parse.body) {
        try {
            const html = await marked(parse.body, { async: true });
            console.log('finding broken images on', file);
            const brokenImages = await findBrokenImages(html);
            if (brokenImages.length > 0) {
                result.brokenImages = brokenImages;
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    return result;
}
function findBrokenImagesGlob(config = getConfig()) {
    const globStream = new glob.Glob('**/*.md', {
        withFileTypes: false,
        absolute: true,
        cwd: config.cwd,
        ignore: ['**/node_modules/**', '**/vendor/**', '**/License.md', '**/readme.md']
    });
    return new Bluebird((resolve) => {
        const files = [];
        globStream.stream().on('data', (result) => {
            files.push(result);
            start();
        });
        let running = false;
        async function start() {
            // skip run when still running
            if (running)
                return;
            const reportFile = path.join(config.source_dir, 'reports/index.md');
            const reports = [];
            while (files.length > 0) {
                // start
                running = true;
                const file = files.shift() || '';
                if (file.length > 0) {
                    const report = await toHtml(file);
                    reports.push(report);
                }
                // delay 3s
                // await delay(3000);
                // stop
                running = false;
            }
            const metadata = ['---', 'title: Reports', 'type: page', `date: ${moment().format()}`, '---'].join('\n');
            const body = [`## Blog Reports`, '```json', JSON.stringify(reports, null, 2), '```'].join('\n');
            writefile(reportFile, metadata + '\n\n' + body);
            resolve();
        }
    });
}

export { findBrokenImages as default, findBrokenImagesGlob, hexoFindBrokenImages };
