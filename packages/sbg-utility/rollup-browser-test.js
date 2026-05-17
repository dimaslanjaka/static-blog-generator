import fs from 'fs-extra';
import { spawn } from 'node:child_process';
import { watch as fsWatch } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, 'dist/browser');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';
const sseClients = new Set();
let reloadTimer;
let isBuilding = false;

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

const debugHtmlPath = path.join(__dirname, 'rollup-browser-test.html');

function runBuildBrowser() {
  return new Promise((resolve) => {
    const child = spawn('yarn', ['build-browser'], {
      cwd: __dirname,
      shell: true
    });

    let output = '';
    const appendOutput = (chunk) => {
      output += chunk;
      if (output.length > 120000) {
        output = output.slice(-120000);
      }
    };

    child.stdout?.on('data', (data) => {
      appendOutput(String(data));
    });
    child.stderr?.on('data', (data) => {
      appendOutput(String(data));
    });

    child.on('error', (error) => {
      resolve({ ok: false, code: -1, error: error.message, output });
    });
    child.on('close', (code) => {
      resolve({ ok: code === 0, code, output });
    });
  });
}

function broadcastReload() {
  for (const res of sseClients) {
    res.write('data: reload\\n\\n');
  }
}

function scheduleReloadBroadcast() {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(broadcastReload, 120);
}

try {
  fsWatch(rootDir, { recursive: true }, () => {
    scheduleReloadBroadcast();
  });
} catch (error) {
  console.warn('Live reload watcher not available:', error?.message || error);
}

function safeJoin(base, requestPath) {
  const normalized = path.normalize(requestPath).replace(/^([/\\])+/, '');
  const resolved = path.resolve(base, normalized);
  if (!resolved.startsWith(base)) return null;
  return resolved;
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || `${host}:${port}`}`);
    const pathname = decodeURIComponent(url.pathname);

    if (pathname === '/' || pathname === '/debug') {
      try {
        const html = await fs.readFile(debugHtmlPath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(html);
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Could not load debug HTML: ' + (e?.message || e));
      }
      return;
    }

    if (pathname === '/__events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-store',
        Connection: 'keep-alive'
      });
      res.write('data: connected\\n\\n');
      sseClients.add(res);
      req.on('close', () => {
        sseClients.delete(res);
      });
      return;
    }

    if (pathname === '/favicon.ico') {
      const icoBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
      const buf = Buffer.from(icoBase64, 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store'
      });
      res.end(buf);
      return;
    }

    if (pathname === '/__build') {
      if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, message: 'Method not allowed' }));
        return;
      }

      if (isBuilding) {
        res.writeHead(409, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, message: 'Build already running' }));
        return;
      }

      isBuilding = true;
      const result = await runBuildBrowser();
      isBuilding = false;

      res.writeHead(result.ok ? 200 : 500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(result));
      return;
    }

    const filePath = safeJoin(rootDir, pathname);
    if (!filePath) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Invalid path');
      return;
    }

    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': contentTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(data);
  } catch (error) {
    const code = error && error.code === 'ENOENT' ? 404 : 500;
    const message = code === 404 ? 'Not found' : `Server error: ${error?.message || 'unknown'}`;
    res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(message);
  }
});

server.listen(port, host, () => {
  console.log(`Debug server running at http://${host}:${port}`);
  console.log(`Serving files from ${rootDir}`);
  console.log('Open /debug (or /) to load dist/browser/index-browser.mjs');
});
