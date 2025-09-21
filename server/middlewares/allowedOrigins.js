import db from '../api/db';

let allowedOrigins = [];

export const addAllowedOrigin = domain => {
  allowedOrigins.push(domain);
};

export const removeAllowedOrigin = domain => {
  allowedOrigins = allowedOrigins.filter(d => d !== domain);
};

db.project.findMany().then(projects => {
  allowedOrigins.push(...projects.map(p => p.domain));
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
