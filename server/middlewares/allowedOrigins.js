import db from '../api/db';

let allowedOrigins = [];

export const addAllowedOrigin = domain => {
  allowedOrigins.push(domain);
};

export const removeAllowedOrigin = domain => {
  allowedOrigins = allowedOrigins.filter(d => d !== domain);
};

const normalizeOrigin = o => (o && !o.endsWith('/') ? `${o}/` : o);

export const isAllowedOrigin = origin => {
  if (!origin) return true;
  return allowedOrigins.includes(normalizeOrigin(origin));
};

db.project
  .findMany()
  .then(projects => {
    allowedOrigins.push(...projects.map(p => p.domain));
    console.log('===allowedOrigins', allowedOrigins);
  })
  .catch(err => {
    console.error(
      'Failed to load allowed origins from DB:',
      err.meta?.target || err.message.split('\n').filter(Boolean).pop(),
    );
  });

export default (req, res, next) => {
  if (isAllowedOrigin(req.headers.origin)) {
    next();
  } else {
    res.status(403).send('Not allowed!');
  }
};
