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
let buildLogBroadcastTimer;
let reloadsSuppressed = false;
let pendingReload = false;
let isBuilding = false;
const buildLogPath = path.join(__dirname, 'tmp', 'rollup-browser-test.log');
let buildLogText = '';
let lastBuildResult = { ok: false, code: null, startedAt: null, finishedAt: null };

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

function initializeBuildLog() {
  fs.ensureDirSync(path.dirname(buildLogPath));

  if (fs.existsSync(buildLogPath)) {
    buildLogText = fs.readFileSync(buildLogPath, 'utf8');
    return;
  }

  fs.writeFileSync(buildLogPath, '');
}

initializeBuildLog();

function resetBuildLog() {
  buildLogText = '';
  fs.writeFileSync(buildLogPath, buildLogText);
  scheduleBuildLogBroadcast();
}

function appendBuildLog(text) {
  buildLogText += text;
  fs.writeFileSync(buildLogPath, buildLogText);
  scheduleBuildLogBroadcast();
}

function appendBuildLogLine(text = '') {
  appendBuildLog(`${text}\n`);
}

function broadcastSseEvent(eventName, data = 'update') {
  const payload = String(data).replace(/\r?\n/g, '\n');

  for (const res of sseClients) {
    res.write(`event: ${eventName}\n`);
    for (const line of payload.split('\n')) {
      res.write(`data: ${line}\n`);
    }
    res.write('\n');
  }
}

function scheduleBuildLogBroadcast() {
  clearTimeout(buildLogBroadcastTimer);
  buildLogBroadcastTimer = setTimeout(() => broadcastSseEvent('build-log'), 100);
}

function getBuildLogSnapshot() {
  return {
    ok: true,
    building: isBuilding,
    output: buildLogText,
    logPath: buildLogPath,
    lastBuildResult
  };
}

function runBuildBrowser() {
  return new Promise((resolve) => {
    resetBuildLog();
    appendBuildLogLine(`===== build-browser started ${new Date().toISOString()} =====`);

    const child = spawn('yarn', ['build-browser'], {
      cwd: __dirname,
      shell: true
    });

    let output = '';
    const appendOutput = (chunk) => {
      const text = String(chunk);
      output += text;
      appendBuildLog(text);
    };

    child.stdout?.on('data', (data) => {
      appendOutput(String(data));
    });
    child.stderr?.on('data', (data) => {
      appendOutput(String(data));
    });

    child.on('error', (error) => {
      appendBuildLogLine(`===== build-browser failed ${new Date().toISOString()} =====`);
      resolve({ ok: false, code: -1, error: error.message, output, logPath: buildLogPath });
    });
    child.on('close', (code) => {
      const ok = code === 0;
      appendBuildLogLine(`===== build-browser finished ${new Date().toISOString()} code=${code} ok=${ok} =====`);
      resolve({ ok, code, output, logPath: buildLogPath });
    });
  });
}

function broadcastReload() {
  broadcastSseEvent('reload');
}

function scheduleReloadBroadcast() {
  if (reloadsSuppressed) {
    pendingReload = true;
    return;
  }

  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(broadcastReload, 120);
}

function startWatch(targetPath, label, recursive = false) {
  try {
    const watcher = fsWatch(targetPath, { recursive }, (changeType, filename) => {
      const changedPath = recursive && filename ? path.join(label, filename) : label;
      console.log(`File change detected: ${changeType} ${changedPath}`);
      scheduleReloadBroadcast();
    });

    watcher.on('error', (error) => {
      console.warn(`Live reload watcher error for ${label}:`, error?.message || error);
    });

    return watcher;
  } catch (error) {
    console.warn(`Live reload watcher not available for ${label}:`, error?.message || error);
    return null;
  }
}

const watchers = [
  startWatch(path.dirname(rootDir), 'dist/browser', true),
  startWatch(debugHtmlPath, 'rollup-browser-test.html'),
  startWatch(path.join(__dirname, 'package.json'), 'package.json')
].filter(Boolean);

process.on('exit', () => {
  for (const watcher of watchers) {
    watcher.close();
  }
});

function safeJoin(base, requestPath) {
  const normalized = path.normalize(requestPath).replace(/^([/\\])+/, '');
  const resolved = path.resolve(base, normalized);
  if (!resolved.startsWith(base)) return null;
  return resolved;
}

function resolveRequestPath(pathname) {
  const distBrowserPrefix = '/dist/browser/';
  if (pathname.startsWith(distBrowserPrefix)) {
    return pathname.slice(distBrowserPrefix.length - 1);
  }

  if (pathname === '/dist/browser') {
    return '/';
  }

  return pathname;
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

    if (pathname === '/__build-log') {
      if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, message: 'Method not allowed' }));
        return;
      }

      const snapshot = getBuildLogSnapshot();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(snapshot));
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
      reloadsSuppressed = true;
      lastBuildResult = { ok: false, code: null, startedAt: new Date().toISOString(), finishedAt: null };
      scheduleBuildLogBroadcast();

      let result;
      try {
        result = await runBuildBrowser();
      } finally {
        isBuilding = false;
        reloadsSuppressed = false;
        lastBuildResult = {
          ok: Boolean(result && result.ok),
          code: result && typeof result.code !== 'undefined' ? result.code : null,
          startedAt: lastBuildResult.startedAt,
          finishedAt: new Date().toISOString()
        };
        scheduleBuildLogBroadcast();

        if (pendingReload) {
          pendingReload = false;
          scheduleReloadBroadcast();
        }
      }

      res.writeHead(result.ok ? 200 : 500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(result));
      return;
    }

    const filePath = safeJoin(rootDir, resolveRequestPath(pathname));
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
  console.log('Open /debug (or /) to load dist/browser/index.mjs');
});
