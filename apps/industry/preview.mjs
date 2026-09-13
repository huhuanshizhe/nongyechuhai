import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), 'dist');
const mime = {
  '.webp': 'image/webp',
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};
http
  .createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(
        new URL(req.url, 'http://localhost').pathname,
      );
      if (path === '/') path = '/index.html';
      else if (!extname(path)) path += '.html';
      const file = resolve(root, '.' + path);
      if (!file.startsWith(root + '\\') && !file.startsWith(root + '/')) {
        res.writeHead(403).end();
        return;
      }
      const body = await readFile(file);
      res
        .writeHead(200, {
          'content-type': mime[extname(file)] || 'application/octet-stream',
        })
        .end(body);
    } catch {
      res
        .writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
        .end(await readFile(resolve(root, '404.html')));
    }
  })
  .listen(4300, '127.0.0.1', () =>
    console.log('Industry preview: http://localhost:4300'),
  );
