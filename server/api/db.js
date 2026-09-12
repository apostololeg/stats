import { PrismaClient } from '@prisma/client';

const url = process.env.DATABASE_URL || '';
const sep = url.includes('?') ? '&' : '?';
const timedUrl = url ? `${url}${sep}connect_timeout=5&pool_timeout=5` : url;

const db = new PrismaClient({
  datasources: { db: { url: timedUrl } },
});

function logPrismaError(kind, err) {
  const msg =
    err?.meta?.target || err?.message?.split('\n').filter(Boolean).pop() || err;
  console.error(kind, msg);
}

process.on('unhandledRejection', err => {
  logPrismaError('unhandledRejection', err);
});

process.on('uncaughtException', err => {
  logPrismaError('uncaughtException', err);
});

db.$connect().catch(err => logPrismaError('Prisma connect failed', err));

export default db;
