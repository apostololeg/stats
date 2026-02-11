import auth from './auth';
import project from './project';
import report from './report';

export default function (app) {
  app.use('/api/auth', auth);
  app.use('/api/report', report);
  app.use('/api/project', project);
}
