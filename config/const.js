const { parsed: env } = require('dotenv').config();

env.PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = env;
