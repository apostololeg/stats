import { Router } from 'express';

import { launcher, iframe } from '../client';
const client = Router();

export default client
  .get('/', (req, res) => res.type('js').send(launcher))
  .get('/iframe', (req, res) => res.type('html').send(iframe));
