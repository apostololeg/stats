import auth from './auth';
import agent from './agent';
import report from './report';
import project from './project';

export default function (app) {
  app.use('/api/auth', auth);
  app.use('/api/agent', agent);
  app.use('/api/report', report);
  app.use('/api/project', project);
}
