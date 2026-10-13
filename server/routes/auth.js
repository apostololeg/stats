import { Router } from 'express';

import { COOKIE_TOKEN_NAME, PRODUCTION } from '../../config/const';
import { createAdminToken, isAdmin, setCookie } from '../api/auth';

const router = Router();

export const adminMiddleware = (req, res, next) => {
  if (!PRODUCTION) return next();
  if (!isAdmin(req)) return res.status(403).send('Forbidden');
  next();
};

export default router
  .get('/check', (req, res) => {
    if (!isAdmin(req)) return res.status(403).send('Forbidden');
    res.json({ ok: true });
  })

  .get('/:key', (req, res) => {
    const { key } = req.params;

    if (key !== process.env.ADMIN_KEY) {
      return res.status(403).send('Forbidden');
    }

    setCookie(res, COOKIE_TOKEN_NAME, createAdminToken(key));

    res.redirect('/');
  });
