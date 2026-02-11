import { Router } from 'express';

import {
  COOKIE_TOKEN_NAME,
  PRODUCTION,
  SESSION_EXPIRED_AFTER,
} from '../../config/const';
import { encodeToken, isAdmin, setCookie } from '../api/auth';

const router = Router();

export const adminMiddleware = (req, res, next) => {
  if (!PRODUCTION) return next();
  if (!isAdmin(req)) return res.status(403).send('Forbidden');
  next();
};

export default router.get('/:key', (req, res) => {
  const { key } = req.params;

  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).send('Forbidden');
  }

  setCookie(
    res,
    COOKIE_TOKEN_NAME,
    encodeToken({ key }, { expiresIn: SESSION_EXPIRED_AFTER }),
  );

  res.redirect('/');
});
