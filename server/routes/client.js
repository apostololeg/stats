import fs from 'fs';
import path from 'path';
import { Router } from 'express';

import { DOMAIN } from '../../config/const';

const clientScript = fs
  .readFileSync(path.resolve(__dirname, '../client.js'), 'utf8')
  .replaceAll('{DOMAIN}', DOMAIN); //.replaceAll(/ |\n/g, '');

const client = Router();

export default client.get('/', (req, res) => res.type('js').send(clientScript));
