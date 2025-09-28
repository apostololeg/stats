const { parsed: env } = require('dotenv').config();
const { version } = require('../package.json');

const config = env || {};
config.PRODUCTION = process.env.NODE_ENV === 'production';
config.SERVER_PORT = process.env.SERVER_PORT || '3000';
config.DEV_PORT = process.env.DEV_PORT || '8080';
config.VERSION = version;

module.exports = config;
