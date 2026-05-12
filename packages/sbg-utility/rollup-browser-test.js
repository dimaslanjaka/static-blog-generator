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

const debugHtml = `<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>sbg-utility browser debug</title>
		<style>
			body { font-family: Consolas, monospace; margin: 2rem; }
			code { background: #f0f0f0; padding: 0.1rem 0.3rem; }
      #status { color: #555; font-size: 0.9rem; }
			#buildBtn { margin-top: 0.5rem; padding: 0.4rem 0.8rem; cursor: pointer; }
		</style>
	</head>
	<body>
		<h1>sbg-utility browser debug</h1>
    <p>Loading <code>/index-browser.mjs</code> with live reload.</p>
    <p id="status">Watching dist/browser for changes...</p>
    <button id="buildBtn" type="button">Build Browser</button>
    <script type="module">
      const status = document.getElementById('status');
      const buildBtn = document.getElementById('buildBtn');
      const eventUrl = '/__events';
      const moduleUrl = '/index-browser.mjs';

      const loadModule = () => import(moduleUrl + '?t=' + Date.now());
      loadModule().catch((err) => {
        console.error('Initial module load failed:', err);
        status.textContent = 'Initial module load failed. Check console.';
      });

      const events = new EventSource(eventUrl);
      events.onopen = () => {
        status.textContent = 'Connected. Waiting for dist changes...';
      };
      events.onmessage = (event) => {
        if (event.data === 'reload') {
          status.textContent = 'Change detected. Reloading...';
          location.reload();
        }
      };
      events.onerror = () => {
        status.textContent = 'Live reload connection lost. Retrying...';
      };

      buildBtn.addEventListener('click', async () => {
        buildBtn.disabled = true;
        status.textContent = 'Running yarn build-browser...';
        try {
          const response = await fetch('/__build', { method: 'POST' });
          const result = await response.json();
          if (!response.ok || !result.ok) {
            status.textContent = 'Build failed. Check browser console.';
            console.error(result.output || result.error || result.message || 'Unknown build error');
            return;
          }
          status.textContent = 'Build completed. Waiting for live reload...';
          if (result.output) {
            console.log(result.output);
          }
        } catch (error) {
          status.textContent = 'Build request failed. Check browser console.';
          console.error(error);
        } finally {
          buildBtn.disabled = false;
        }
      });
    </script>
	</body>
</html>`;

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
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(debugHtml);
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
