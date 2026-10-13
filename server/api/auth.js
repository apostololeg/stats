import jwt from 'jsonwebtoken';
import ms from 'ms';

import {
  ADMIN_KEY,
  COOKIE_TOKEN_NAME,
  JWT_SECRET,
  PRODUCTION,
  SESSION_EXPIRED_AFTER,
} from '../../config/const';
import { getAuthToken } from '../tools/tokens';

const DEFAULT_SESSION = '365d';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: PRODUCTION,
  path: '/',
  sameSite: 'lax',
};

// Without maxAge the browser stores a session cookie. Desktop browsers keep
// that for the browser session; a mobile standalone app drops it on kill.
export function sessionCookieMaxAge() {
  const raw =
    typeof SESSION_EXPIRED_AFTER === 'string' && SESSION_EXPIRED_AFTER
      ? SESSION_EXPIRED_AFTER
      : DEFAULT_SESSION;
  const parsed = ms(raw);

  return typeof parsed === 'number' ? parsed : ms(DEFAULT_SESSION);
}

export const encodeToken = (data, params = {}) =>
  jwt.sign(data, JWT_SECRET, params);

export function createAdminToken(key, secret = JWT_SECRET) {
  return jwt.sign({ key }, secret, {
    expiresIn: SESSION_EXPIRED_AFTER || DEFAULT_SESSION,
  });
}

export const decodeToken = token => {
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) ?? {};
  } catch (e) {
    return null;
  }
};

export const setCookie = (res, name, value, opts = {}) =>
  res.cookie(name, value, {
    ...COOKIE_OPTS,
    maxAge: sessionCookieMaxAge(),
    ...opts,
  });

export const clearCookie = res =>
  res.clearCookie(COOKIE_TOKEN_NAME, COOKIE_OPTS);

export const isAdmin = req => parseUserId(req) === ADMIN_KEY;

function parseUserId(req) {
  const authToken = getAuthToken(req);

  if (!authToken) return null;

  return decodeToken(authToken)?.key;
}
