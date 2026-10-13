import assert from 'assert';
import http from 'http';

import express from 'express';
import jwt from 'jsonwebtoken';

import {
  clearCookie,
  createAdminToken,
  sessionCookieMaxAge,
  setCookie,
} from './auth';

const ONE_YEAR_SEC = 365 * 24 * 60 * 60;

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
  assert.strictEqual(Math.floor(maxAgeMs / 1000), ONE_YEAR_SEC);

  const app = express();
  app.get('/login', (req, res) => {
    setCookie(res, 'x-token', 'token-value');
    res.end('ok');
  });

  const server = await listen(app);
  const { port } = server.address();

  try {
    const header = await getSetCookie(port, '/login');

    assert.ok(header.includes('x-token=token-value'), header);
    assert.ok(header.includes(`Max-Age=${ONE_YEAR_SEC}`), header);
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

  const decoded = jwt.decode(createAdminToken('admin-key', 'test-secret'));
  assert.strictEqual(decoded.exp - decoded.iat, ONE_YEAR_SEC);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
