import fs from 'fs';
import fsp from 'fs/promises';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

// ---------- args ----------
const args = process.argv.slice(2);
const port = (() => {
  const i = args.indexOf('--port');
  return i !== -1 && args[i + 1] ? Number(args[i + 1]) : 3000;
})();
const builtMode = args.includes('--built') || args.includes('--dist');

if (builtMode && !fs.existsSync(path.join(repoRoot, 'dist', 'index.html'))) {
  console.error('No build output found. Run "bun run build" first, then retry.');
  process.exit(1);
}

const webRoot = builtMode
  ? path.join(repoRoot, 'dist')
  : path.join(repoRoot, 'website');
const dataRoot = builtMode
  ? path.join(repoRoot, 'dist', 'data')
  : path.join(repoRoot, 'data', 'source');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.map': 'application/json',
};

// ---------- live reload (dev mode only) ----------
const reloadClients = new Set();
let reloadTimer = null;

function broadcastReload() {
  for (const res of reloadClients) res.write('data: reload\n\n');
}

function watchDirs() {
  if (builtMode) return;
  for (const dir of [webRoot, dataRoot]) {
    // fs.watch is best-effort across editors (some write via rename)
    fs.watch(dir, { recursive: true }, () => {
      clearTimeout(reloadTimer);
      reloadTimer = setTimeout(broadcastReload, 120); // debounce multi-event saves
    });
  }
}

// ---------- static serving ----------
async function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  if (decoded.includes('..')) return null; // traversal guard
  let filePath = path.join(webRoot, decoded);
  const stat = await fsp.stat(filePath).catch(() => null);
  if (stat?.isDirectory()) filePath = path.join(filePath, 'index.html');
  return fs.existsSync(filePath) ? filePath : null;
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://localhost:${port}`);

  if (pathname === '/__livereload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('retry: 1000\n\n');
    reloadClients.add(res);
    req.on('close', () => reloadClients.delete(res));
    return;
  }

  if (pathname === '/__reload.js') {
    res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
    res.end(`new EventSource('/__livereload').onmessage = () => location.reload();`);
    return;
  }

  // In dev mode, /data/* maps to the editable data/source files so the
  // fetching code path is identical to production.
  if (pathname.startsWith('/data/')) {
    const dataFile = path.join(dataRoot, pathname.slice('/data/'.length));
    const payload = await fsp.readFile(dataFile).catch(() => null);
    if (payload === null) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': MIME['.json'] });
    return res.end(payload);
  }

  const filePath = await resolveFile(pathname);
  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Not found');
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });

  if (ext === '.html' && !builtMode) {
    let html = await fsp.readFile(filePath, 'utf8');
    html = html.replace('</body>', '<script src="/__reload.js"></script>\n</body>');
    res.end(html);
  } else {
    fsp.readFile(filePath).then(body => res.end(body));
  }
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is in use. Try: node scripts/dev-server.mjs --port 3001`);
    process.exit(1);
  }
  throw err;
});

server.listen(port, () => {
  const mode = builtMode ? 'built site (dist/)' : 'live source (website/ + data/source/)';
  console.log(`Dev server [${mode}] → http://localhost:${port}`);
  if (!builtMode) console.log('Live reload enabled — edit website/ or data/source/ and the browser refreshes.');
});

watchDirs();
