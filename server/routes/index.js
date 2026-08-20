import auth from './auth';
import live from './live';
import project from './project';
import report from './report';

export default function (app) {
  app.use('/api/auth', auth);
  app.use('/api/live', live);
  app.use('/api/report', report);
  app.use('/api/project', project);
}
