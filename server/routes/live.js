import express from 'express';

import db from '../api/db';
import { adminMiddleware } from './auth';

const router = express.Router();

function threeMonthsAgo() {
  const date = new Date();
  date.setMonth(date.getMonth() - 3);
  return date;
}

function sortValues(set) {
  return [...set].sort();
}

export default router.get('/filters', adminMiddleware, async (req, res) => {
  try {
    const events = await db.event.findMany({
      where: { time: { gte: threeMonthsAgo() } },
      select: { cid: true, pid: true, time: true, data: true },
    });

    const times = new Set();
    const countries = new Set();
    const pages = new Set();
    const eventNames = new Set();
    const clients = new Set();
    const pids = new Set();

    events.forEach(({ cid, pid, time, data }) => {
      times.add(time.toISOString().slice(0, 10));
      if (data?.country) countries.add(data.country);
      if (data?.page) pages.add(data.page);
      if (data?.event) eventNames.add(data.event);
      clients.add(cid);
      pids.add(pid);
    });

    const projects = pids.size
      ? await db.project.findMany({
          where: { id: { in: [...pids] } },
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        })
      : [];

    const type = [];
    if (pages.size) type.push('page');
    if (eventNames.size) type.push('event');

    res.json({
      time: [...times].sort().reverse(),
      country: sortValues(countries),
      project: projects,
      type: type.length ? type : ['page', 'event'],
      name: sortValues(new Set([...pages, ...eventNames])),
      client: sortValues(clients),
    });
  } catch (err) {
    console.error('Live filter options error:', err);
    res.status(500).send({ ok: false });
  }
});
