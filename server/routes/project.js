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

let total = 0;

db.project.count().then(n => (total = n));

router
  .get('/', async (req, res) => {
    const params = parseIds(req.query, ['skip', 'take']);

    if (!params.take || params.take > PAGE_SIZE) params.take = PAGE_SIZE;

    params.select = { id: true, name: true };
    params.orderBy = {
      updatedAt: 'desc',
      ...params?.orderBy,
    };

    const projects = await db.project.findMany(params);

    res.json({ projects, total });
  })

  .post('/', adminMidleware, async (req, res) => {
    const data = { name: req.body.name };
    const project = await db.project.create({ data });

    total++;
    res.json({ project, total });
  })

  .get('/client/:projectId', async (req, res) => {
    const { projectId } = req.params;

    if (!projectId) return res.json(null);

    // check if project exists
    const project = db.project.findUnique({ where: { id: projectId } });
    if (!project) return res.json(null);

    if (!decodeToken(getClientToken(req))) {
      const token = encodeToken({ cid: generateClientId(), projectId });
      setCookie(res, COOKIE_TOKEN_NAME_CLIENT, token);
    }

    return res.type('.js').send(client);
  })

  .delete('/:id', adminMidleware, async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
      const res = await db.project.delete({ where: { id } });
      total--;

      res.json({ total });
    } catch (e) {
      res.status(404).send('Not found');
    }
  });

export default router;
