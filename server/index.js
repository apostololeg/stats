import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import session from 'express-session';
import compression from 'compression';

import { PRODUCTION, SERVER_PORT, JWT_SECRET } from '../config/const';

import routes from './routes';

const app = express();

if (!PRODUCTION) {
  // on production, nginx will serve the static files
}

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50kb' }));
app.use(methodOverride());
app.use(session({ secret: JWT_SECRET, resave: true, saveUninitialized: true }));

routes(app);

app.listen({ port: SERVER_PORT }, () => {
  console.log(`\n  🚀  App ready on port ${SERVER_PORT}\n`);
});
