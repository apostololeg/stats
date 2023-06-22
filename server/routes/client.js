import fs from 'fs';
import path from 'path';
import express from 'express';

import { PROTOCOL, DOMAIN, COOKIE_TOKEN_NAME_CLIENT } from '../../config/const';

import { PAGE_SIZE } from '../../src/shared/db';
import { parseIds } from '../../src/shared/parsers';
import { generateClientId, getClientToken } from '../tools/tokens';

import db from '../api/db';

import { adminMidleware } from './auth';
import { decodeToken, encodeToken, setCookie } from '../api/auth';

let client = fs.readFileSync(path.resolve(__dirname, '../client.js'), 'utf8');
client = client.replace('{DOMAIN}', `${DOMAIN}/api`); //.replaceAll(/ |\n/g, '');

const router = express.Router();

router.get('/:projectId', async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) return res.json(null);

  // check if project exists
  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) return res.json(null);

  if (!decodeToken(getClientToken(req))) {
    const token = encodeToken({ cid: generateClientId(), projectId });
    setCookie(res, COOKIE_TOKEN_NAME_CLIENT, token);
  }

  return res.type('.js').send(client);
});

export default router;
