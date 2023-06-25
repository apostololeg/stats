import fs from 'fs';
import path from 'path';

import { DOMAIN } from '../../config/const';

export const laucher = fs
  .readFileSync(path.resolve(__dirname, './laucher.js'), 'utf8')
  .replaceAll('{DOMAIN}', DOMAIN); //.replaceAll(/ |\n/g, '');

export const iframe = fs
  .readFileSync(path.resolve(__dirname, './iframe.html'), 'utf8')
  .replaceAll('{DOMAIN}', DOMAIN); //.replaceAll(/ |\n/g, '');
