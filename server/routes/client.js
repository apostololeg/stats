import { Router } from 'express';

import { laucher, iframe } from '../client';

const client = Router();

export default client
  .get('/', (req, res) => res.type('js').send(laucher))
  .get('/iframe', (req, res) => res.type('html').send(iframe));
