import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import session from 'express-session';
import compression from 'compression';
// import cors from 'cors';

import { PRODUCTION, SERVER_PORT, JWT_SECRET } from '../config/const';

// import db from './api/db';
import routes from './routes';

const app = express();

if (PRODUCTION) {
  // const allowedOrigins = [];
  // db.project.findMany().then(projects => {
  //   allowedOrigins.push(...projects.map(p => p.domain));
  // });
  // app.use(
  //   cors({
  //     origin: function (origin, callback) {
  //       console.log('===origin', origin);
  //       if (!origin && allowedOrigins.includes(origin)) {
  //         callback(null, true);
  //       } else {
  //         callback(new Error('Not allowed by CORS'));
  //       }
  //     },
  //     optionsSuccessStatus: 200,
  //     credentials: true,
  //   })
  // );
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
