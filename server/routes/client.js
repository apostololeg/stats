import { Router } from 'express';

import { laucher, iframe } from '../client';
import db from '../api/db';

const client = Router();

export const allowedOrigins = [];

db.project.findMany().then(projects => {
  allowedOrigins.push(...projects.map(p => p.domain));
  console.log('===allowedOrigins', allowedOrigins);
});

const allowedOriginsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    next();
  } else {
    res.status(403).send('Not allowed!');
  }
};

export default client
  .get('/', allowedOriginsMiddleware, (req, res) =>
    res.type('js').send(laucher)
  )
  .get('/iframe', allowedOriginsMiddleware, (req, res) =>
    res.type('html').send(iframe)
  );
