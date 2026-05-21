import dotenv from 'dotenv';
import fs from 'fs-extra';
import { Project } from 'ts-morph';
import path from 'upath';
import { fileURLToPath } from 'url';

dotenv.config({ override: true, quiet: true });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsDir = path.join(__dirname, 'docs');
fs.emptyDirSync(docsDir);
const generated = [];
const project = new Project({
  tsConfigFilePath: './tsconfig.node.json'
});

const sourceFiles = project.getSourceFiles();

for (const file of sourceFiles) {
  const relativePath = path.relative(process.cwd(), file.getFilePath());
  const destPath = path.join(
    docsDir,
    relativePath.replace(/\.(ts|tsx|js|jsx|cjs|mjs)$/, '.md').replace(/src[\\/]/, '')
  );

  const mdTitle = `API Documentation for ${relativePath}`;
  let md = `# ${mdTitle}\n\n`;
  let anyExported = false;

  function formatTagComment(comment) {
    if (comment == null) return '';
    if (typeof comment === 'string') return comment;
    try {
      return JSON.stringify(comment);
    } catch {
      return String(comment);
    }
  }

  function normalizeImportPaths(text) {
    if (!text) return text;
    return text.replace(/import\("([^"]+)"\)/g, (m, p1) => {
      try {
        // If the specifier looks like a relative or absolute path, normalize to relative.
        // Otherwise (plain module names like "stream" or "lodash"), leave as-is.
        if (
          !p1.startsWith('.') &&
          !p1.startsWith('/') &&
          !/^[A-Za-z]:\\/.test(p1) &&
          !p1.startsWith('file:') &&
          !p1.startsWith('node:')
        ) {
          return `import("${p1}")`;
        }

        const abs = path.isAbsolute(p1) ? p1 : path.resolve(process.cwd(), p1);
        let rel = path.relative(process.cwd(), abs);
        if (!rel.startsWith('.') && !rel.startsWith('/')) rel = './' + rel;
        rel = rel.replace(/\\/g, '/');
        return `import("${rel}")`;
      } catch {
        return m;
      }
    });
  }

  for (const fn of file.getFunctions()) {
    console.log(`Processing ${relativePath} -> ${fn.getName()}`);
    if (!fn.isExported()) {
      console.log(`Skipping non-exported function: ${fn.getName()}`);
      continue;
    }

    anyExported = true;
    const name = fn.getName();
    const docs = fn.getJsDocs();

    md += `## ${name}\n\n`;

    if (docs.length > 0) {
      md += docs[0].getDescription() + '\n\n';
    }

    // collect @param and @returns descriptions and process selected tags (@example, @deprecated, @see)
    const paramDocs = new Map();
    let returnDoc = null;
    const tags = docs.flatMap((d) => d.getTags());
    for (const tag of tags) {
      const tname = tag.getTagName();
      const rawComment = typeof tag.getComment === 'function' ? tag.getComment() : undefined;
      if (tname === 'param') {
        let pname = typeof tag.getName === 'function' ? tag.getName() : undefined;
        let pcomment = rawComment;
        if (!pname) {
          const text = typeof tag.getText === 'function' ? tag.getText() : '';
          const m = text.match(/^@param\s+(\S+)\s*([\s\S]*)$/);
          if (m) {
            pname = m[1];
            pcomment = m[2];
          }
        }
        if (pname) paramDocs.set(pname, formatTagComment(pcomment));
      } else if (tname === 'returns' || tname === 'return') {
        returnDoc = formatTagComment(rawComment);
      }
    }

    for (const tag of tags) {
      const tname = tag.getTagName();
      const rawComment = typeof tag.getComment === 'function' ? tag.getComment() : undefined;
      if (tname === 'example') {
        md += '### Example\n\n';
        md += '```ts\n' + formatTagComment(rawComment) + '\n```\n\n';
      } else if (tname === 'deprecated') {
        const text = typeof tag.getText === 'function' ? tag.getText() : undefined;
        const content = text ? text.replace(/^@deprecated\s*/i, '') : formatTagComment(rawComment);
        md += '### Deprecated\n\n' + content + '\n\n';
      } else if (tname === 'see') {
        const text = typeof tag.getText === 'function' ? tag.getText() : undefined;
        let content = text ? text.replace(/^@see\s*/i, '') : formatTagComment(rawComment);
        // unwrap {@link ...} and trim stray asterisks/newlines
        content = content
          // eslint-disable-next-line no-useless-escape
          .replace(/\{\@link\s+([^}]+)\}/g, '$1')
          .replace(/\s*\*\s*$/g, '')
          .trim();
        md += '### See\n\n' + content + '\n\n';
      }
      // ignore other tags to avoid duplicating param/return sections
    }

    md += '### Parameters\n\n';

    for (const param of fn.getParameters()) {
      const pname = param.getName();
      const ptype = normalizeImportPaths(param.getType().getText());
      const pdesc = paramDocs.get(pname);
      md += `- \`${pname}\`: \`${ptype}\``;
      if (pdesc) md += ` — ${pdesc}`;
      md += `\n`;
    }

    md += '\n';

    const returnTypeStr = normalizeImportPaths(fn.getReturnType().getText());
    if (returnDoc) {
      md += `### Returns\n\n`;
      md += `\`${returnTypeStr}\` — ${returnDoc}\n\n`;
    } else {
      md += `Returns \`${returnTypeStr}\`\n\n`;
    }

    md += `---\n\n`;
  }

  if (anyExported) {
    fs.ensureDirSync(path.dirname(destPath));
    fs.writeFileSync(destPath, md);
    // record generated doc for index
    const relLink = './' + path.relative(docsDir, destPath).replace(/\\/g, '/');
    generated.push({ title: mdTitle, link: relLink, source: relativePath });
  }
}

// write an index (index.md) into docs with links to all generated docs
if (generated.length > 0) {
  let indexMd = '# API Documentation Index\n\n';
  indexMd += 'This index links to all generated API documentation pages.\n\n';
  // sort by title for stable output
  generated.sort((a, b) => a.title.localeCompare(b.title));
  for (const g of generated) {
    indexMd += `- [${g.title}](${g.link}) — Source: ${g.source}\n`;
  }
  fs.writeFileSync(path.join(docsDir, 'index.md'), indexMd);
}

// Copy rollup-browser-test.html,dist/browser/* to docs
fs.copySync(
  path.join(__dirname, 'rollup-browser-test.html'),
  path.join(docsDir, 'browser', 'rollup-browser-test.html')
);
fs.copySync(path.join(__dirname, 'dist/browser'), path.join(docsDir, 'browser/dist'));
