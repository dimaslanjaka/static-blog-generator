import * as cp from 'cross-spawn';
import fs from 'fs-extra';
import { globSync } from 'glob';
import { marked } from 'marked';
import minimist from 'minimist';
import { fileURLToPath } from 'node:url';
import nunjucks from 'nunjucks';
import path from 'upath';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repo = {
  dir: path.join(__dirname, 'tmp/gh-pages'),
  url: 'https://github.com/dimaslanjaka/static-blog-generator',
  branch: 'gh-pages',
  token: process.env.ACCESS_TOKEN || process.env.GITHUB_TOKEN
};

const OUT_DIR = path.join(repo.dir, 'packages/sbg-utility');
const DOCS_DIR = path.join(__dirname, 'docs');
const TEMPLATE_DIR = path.join(__dirname, 'templates');

nunjucks.configure(TEMPLATE_DIR, {
  autoescape: false
});

// Parse CLI options: --server (-s) to run local server, --commit (-c) to commit & push
const argv = minimist(process.argv.slice(2), {
  boolean: ['server', 'commit'],
  string: ['message'],
  alias: { s: 'server', c: 'commit', m: 'message' },
  default: { server: false, commit: false, message: undefined }
});

const opts = argv;

async function run(cmd, args, options = {}) {
  return cp.async(cmd, args, {
    stdio: 'inherit',
    ...options
  });
}

async function main() {
  const gitDir = path.join(repo.dir, '.git');

  if (!fs.existsSync(gitDir)) {
    console.log('Cloning repository...');

    const cloneUrl = repo.token ? `https://${repo.token}@${repo.url.replace('https://', '')}` : repo.url;

    await run('git', ['clone', '--depth=1', '--branch=' + repo.branch, cloneUrl, repo.dir], {
      cwd: __dirname
    });
  }

  console.log('Generating documentation...');
  await run('node', ['generate-docs.mjs'], { cwd: __dirname });

  console.log('Generating HTML pages from Markdown...');
  await fs.emptyDir(OUT_DIR);
  // Configure marked to use highlight.js for code blocks
  // Use a renderer so the generated <code> elements include `hljs` and language classes
  const renderer = new marked.Renderer();

  // Minimal HTML escaper because `marked.escape` may not exist in this version
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Use client-side highlighting: always output escaped code and set language class
  renderer.code = (code, infostring, escaped) => {
    const lang = (infostring || '').trim().split(/\s+/)[0];
    const classAttr = ['hljs', lang ? `language-${lang}` : 'language-javascript'].filter(Boolean).join(' ');

    // Ensure `code` is a string. Some marked versions or tokens may pass an object.
    let source = code;
    if (typeof source !== 'string') {
      try {
        if (source && typeof source.text === 'string') source = source.text;
        else source = JSON.stringify(source, null, 2);
      } catch {
        source = String(source);
      }
    }

    const safeCode = escaped ? String(source) : escapeHtml(source);
    return `<pre><code class="${classAttr}">${safeCode}</code></pre>\n`;
  };

  marked.setOptions({ renderer });

  const files = globSync('**/*.md', {
    cwd: DOCS_DIR,
    nodir: true
  });

  console.log('Markdown files:', files.length);

  if (!files.length) return;

  for (const file of files) {
    const fullPath = path.join(DOCS_DIR, file);
    const md = fs.readFileSync(fullPath, 'utf8');

    const htmlBody = marked.parse(md);

    // Rewrite relative Markdown links to point to generated .html files.
    // Skip absolute URLs (http/https) so external links to .md are preserved.
    const fixedHtmlBody = htmlBody.replace(
      /href=(["'])(?!https?:\/\/)([^"']+?)\.md(#.*?)?\1/gi,
      (m, quote, p, hash) => {
        return `href=${quote}${p}.html${hash || ''}${quote}`;
      }
    );

    const html = nunjucks.render('layout.njk', {
      title: file,
      content: fixedHtmlBody
    });

    const outFile = path.join(OUT_DIR, file.replace(/\.md$/, '.html'));

    fs.ensureDirSync(path.dirname(outFile));
    fs.writeFileSync(outFile, html);

    console.log('generated:', outFile);
  }

  console.log('Build complete');
  // LOCAL SERVER

  if (opts.server) {
    console.log('\nStarting local server...\n');

    // Serve from repo root so /packages/sbg-utility/ resolves locally.
    await run('npx', ['-y', 'http-server', repo.dir, '-p', '8080'], {
      cwd: __dirname
    });
  }

  // GITHUB PAGES DEPLOY (only when --commit is passed)
  if (opts.commit) {
    if (!repo.token) {
      console.warn('No GITHUB_TOKEN or ACCESS_TOKEN found. Cannot commit/push. Skipping --commit.');
    } else {
      console.log('\nCommitting and pushing to GitHub Pages...\n');

      const commitMsg = opts.message || `chore(docs): update documentation at ${new Date().toISOString()}`;

      await run('git', ['add', OUT_DIR], { cwd: repo.dir });
      await run('git', ['commit', '-m', commitMsg], {
        cwd: repo.dir
      });
      await run('git', ['push', 'origin', repo.branch], { cwd: repo.dir });

      console.log('Deployment complete');
    }
  } else {
    if (repo.token) console.log('Repo token present, but --commit not passed. Skipping commit/push.');
    else console.warn('No GITHUB_TOKEN or ACCESS_TOKEN found. Skipping deployment.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
