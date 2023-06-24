import express from 'express';

import { loader, iframe } from '../agent';

const router = express.Router();

router
  .get('/loader', (req, res) => {
    return res.type('.js').send(loader);
  })
  .get('/iframe', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    return res.type('.html').send(iframe);
  });

export default router;
