const { parsed: env } = require('dotenv').config();
const { version } = require('../package.json');

env.PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = env;
