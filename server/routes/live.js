import express from 'express';

import db from '../api/db';
import { serializeEvent } from '../live/ws';
import { adminMiddleware } from './auth';

const router = express.Router();

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

function normalizeRangeDate(value, isEnd) {
  const str = Array.isArray(value) ? value[0] : value;
  if (!str || typeof str !== 'string') return null;

  const iso = DATE_ONLY_RE.test(str)
    ? `${str}T${isEnd ? '23:59:59.999' : '00:00:00.000'}Z`
    : str;
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return null;
  return date;
}

router.get('/events', adminMiddleware, async (req, res) => {
  try {
    const start = normalizeRangeDate(req.query.startDate, false);
    const end = normalizeRangeDate(req.query.endDate, true);

    if (!start || !end || start > end)
      return res.status(400).send({ ok: false });

    const events = await db.event.findMany({
      where: { time: { gte: start, lte: end } },
      orderBy: { time: 'desc' },
      select: { id: true, cid: true, pid: true, time: true, data: true },
    });

    res.json({ events: events.map(serializeEvent) });
  } catch (err) {
    console.error('Live events error:', err);
    res.status(500).send({ ok: false });
  }
});

function threeMonthsAgo() {
  const date = new Date();
  date.setMonth(date.getMonth() - 3);
  return date;
}

function sortValues(set) {
  return [...set].sort();
}

router.get('/filters', adminMiddleware, async (req, res) => {
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

export default router;
