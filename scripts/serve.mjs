import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.png', 'image/png'],
  ['.pdf', 'application/pdf'],
]);

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', 'http://localhost');
    const requestedPath = decodeURIComponent(url.pathname);
    const target = resolve(siteRoot, requestedPath === '/' ? 'index.html' : `.${requestedPath}`);
    if (!target.startsWith(siteRoot + sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const body = await readFile(target);
    response.writeHead(200, { 'Content-Type': mimeTypes.get(extname(target)) || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => {
  console.log('Portfolio preview listening on http://127.0.0.1:4173');
});