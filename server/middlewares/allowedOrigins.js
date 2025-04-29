import db from '../api/db';

export let allowedOrigins = [];

db.project.findMany().then(projects => {
  allowedOrigins = [...projects.map(p => p.domain)];
  console.log('===allowedOrigins', allowedOrigins);
});

export default (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    next();
  } else {
    res.status(403).send('Not allowed!');
  }
};
