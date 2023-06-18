import jwt from 'jsonwebtoken';

import {
  PRODUCTION,
  JWT_SECRET,
  COOKIE_TOKEN_NAME,
  ADMIN_KEY,
} from '../../config/const';
import { getAuthToken } from '../tools/tokens';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: PRODUCTION,
};

export const encodeToken = (data, params = {}) =>
  jwt.sign(data, JWT_SECRET, params);

export const decodeToken = token => {
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) ?? {};
  } catch (e) {
    return null;
  }
};

export const setCookie = (res, name, value, opts = {}) =>
  res.cookie(name, value, { ...COOKIE_OPTS, ...opts });

export const clearCookie = res =>
  res.clearCookie(COOKIE_TOKEN_NAME, COOKIE_OPTS);

export const isAdmin = req => parseUserId(req) === ADMIN_KEY;

function parseUserId(req) {
  const authToken = getAuthToken(req);

  if (!authToken) return null;

  return decodeToken(authToken)?.key;
}
