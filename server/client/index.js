import fs from 'fs';
import path from 'path';
import UglifyJS from 'uglify-js';

import { DOMAIN } from '../../config/const';

const format = filePath =>
  fs
    .readFileSync(path.resolve(__dirname, filePath), 'utf8')
    .replaceAll('{DOMAIN}', DOMAIN);

export const launcher = UglifyJS.minify(format('./launcher.js')).code;
export const iframe = format('./iframe.html');
