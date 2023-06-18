import { Router } from 'express';

import { isAdmin, setCookie, encodeToken } from '../api/auth';

import { SESSION_EXPIRED_AFTER, COOKIE_TOKEN_NAME } from '../../config/const';

const router = Router();

export const adminMidleware = (req, res, next) => {
  if (!isAdmin(req)) return res.status(403).send('Forbidden');
  next();
};

router.get('/:key', (req, res) => {
  const { key } = req.params;

  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).send('Forbidden');
  }

  setCookie(
    res,
    COOKIE_TOKEN_NAME,
    encodeToken({ key }, { expiresIn: SESSION_EXPIRED_AFTER })
  );

  res.redirect('/');
});

export default router;
