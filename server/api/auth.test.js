import assert from 'assert';
import http from 'http';

import express from 'express';

import { clearCookie, sessionCookieMaxAge, setCookie } from './auth';

function listen(app) {
  return new Promise(resolve => {
    const server = app.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function getSetCookie(port, path) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: '127.0.0.1', port, path }, res => {
      res.resume();
      const header = res.headers['set-cookie'] || [];
      resolve(header.join('\n'));
    });
    req.on('error', reject);
  });
}

async function main() {
  const maxAgeMs = sessionCookieMaxAge();
  assert.strictEqual(typeof maxAgeMs, 'number');
  assert.ok(maxAgeMs > 0, 'auth cookie must outlive the browser session');

  const app = express();
  app.get('/login', (req, res) => {
    setCookie(res, 'x-token', 'token-value');
    res.end('ok');
  });

  const server = await listen(app);
  const { port } = server.address();

  try {
    const header = await getSetCookie(port, '/login');
    const maxAgeSec = Math.floor(maxAgeMs / 1000);

    assert.ok(header.includes('x-token=token-value'), header);
    assert.ok(header.includes(`Max-Age=${maxAgeSec}`), header);
    assert.ok(/HttpOnly/i.test(header), header);
    assert.ok(/SameSite=Lax/i.test(header), header);
    assert.ok(/Path=\//.test(header), header);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }

  const cleared = [];
  clearCookie({
    clearCookie(name, opts) {
      cleared.push({ name, opts });
    },
  });
  assert.strictEqual(cleared.length, 1);
  assert.strictEqual(cleared[0].opts.maxAge, undefined);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
