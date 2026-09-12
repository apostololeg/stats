import express from 'express';

import { PAGE_SIZE } from '../../src/shared/db';
import { parseIds } from '../../src/shared/parsers';
import db from '../api/db';
import {
  addAllowedOrigin,
  removeAllowedOrigin,
} from '../middlewares/allowedOrigins';
import { adminMiddleware } from './auth';

const router = express.Router();

let total = 0;

db.project
  .count()
  .then(n => (total = n))
  .catch(() => {});

export default router
  .get('/', async (req, res) => {
    try {
      const params = parseIds(req.query, ['skip', 'take']);

      if (!params.take || params.take > PAGE_SIZE) params.take = PAGE_SIZE;

      params.select = { id: true, name: true, domain: true };
      params.orderBy = {
        updatedAt: 'desc',
        ...params?.orderBy,
      };

      const [projects, count] = await Promise.all([
        db.project.findMany(params),
        db.project.count(),
      ]);
      total = count;

      res.json({ projects, total });
    } catch (err) {
      console.error('GET /api/project failed:', err.message);
      res.status(503).json({ error: 'Database unavailable' });
    }
  })

  .post('/', adminMiddleware, async (req, res) => {
    try {
      let { id, name, domain } = req.body;

      if (!/\/$/.test(domain)) domain += '/';

      const data = { name, domain };
      const project = await db.project.upsert({
        where: { id },
        create: data,
        update: data,
      });

      addAllowedOrigin(domain);

      total++;
      res.json({ project, total });
    } catch (err) {
      console.error('POST /api/project failed:', err.message);
      res.status(503).json({ error: 'Database unavailable' });
    }
  })

  .delete('/:id', adminMiddleware, async (req, res) => {
    const id = req.params.id;

    console.log('===id', id);
    try {
      const prj = await db.project.findUnique({ where: { id } });
      console.log(' === domain to delete', prj.domain);
      await db.project.delete({ where: { id } });

      removeAllowedOrigin(prj.domain);
      total--;

      res.json({ ok: true, total });
    } catch (e) {
      console.log(' --- error', e);
      res.status(404).send('Not found');
    }
  });
