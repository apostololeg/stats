import auth from './auth';
import report from './report';
import project from './project';

export default function (app) {
  app.use('/api/auth', auth);
  app.use('/api/project', project);
  app.use('/api/report', report);
}
