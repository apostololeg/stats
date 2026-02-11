import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import methodOverride from 'method-override';

import { JWT_SECRET, PRODUCTION, SERVER_PORT } from '../config/const';
import { isAllowedOrigin } from './middlewares/allowedOrigins';
import routes from './routes';

const app = express();

if (PRODUCTION) {
  app.use(
    cors({
      origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      optionsSuccessStatus: 200,
      credentials: true,
    }),
  );
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
