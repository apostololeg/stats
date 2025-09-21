import express from 'express';

import db from '../api/db';
import { PAGE_SIZE } from '../../src/shared/db';
import { parseIds } from '../../src/shared/parsers';

import { adminMiddleware } from './auth';
import { allowedOrigins } from '../middlewares/allowedOrigins';

const router = express.Router();

let total = 0;

db.project.count().then(n => (total = n));

export default router
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

  .post('/', adminMiddleware, async (req, res) => {
    let { name, domain } = req.body;

    if (!/\/$/.test(domain)) domain += '/';

    const data = { name, domain };
    const project = await db.project.create({ data });

    allowedOrigins.push(domain);

    total++;
    res.json({ project, total });
  })

  .delete('/:id', adminMiddleware, async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
      const res = await db.project.delete({ where: { id } });
      total--;

      res.json({ total });
    } catch (e) {
      res.status(404).send('Not found');
    }
  });
