import fs from 'fs';
import path from 'path';

import { DOMAIN } from '../../config/const';

import auth from './auth';
import report from './report';
import project from './project';

const client = fs
  .readFileSync(path.resolve(__dirname, '../client.js'), 'utf8')
  .replaceAll('{DOMAIN}', DOMAIN); //.replaceAll(/ |\n/g, '');

export default function (app) {
  app.use('/api/auth', auth);
  app.use('/api/report', report);
  app.use('/api/project', project);
  app.get('/client', (req, res) => res.type('.js').send(client));
}
