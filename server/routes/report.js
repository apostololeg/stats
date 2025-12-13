import express from 'express';

import { COOKIE_TOKEN_NAME_CLIENT } from '../../config/const';
import { decodeToken, encodeToken, setCookie } from '../api/auth';
import db from '../api/db';
import throttle from '../tools/throttle';
import { timezoneCity2Country } from '../tools/timezoneCity2Country';
import { generateClientId, getClientToken } from '../tools/tokens';

// import { adminMiddleware } from './auth';

const router = express.Router();

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

function normalizeRangeDate(value, { isEnd } = { isEnd: false }) {
  const str = Array.isArray(value) ? value[0] : value;
  if (!str || typeof str !== 'string') return null;

  // Frontend sends YYYY-MM-DD (no time). JS parses that as UTC midnight.
  // For endDate we want the whole day included.
  const iso = DATE_ONLY_RE.test(str)
    ? `${str}T${isEnd ? '23:59:59.999' : '00:00:00.000'}Z`
    : str;

  const d = new Date(iso);
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(d.getTime())) return null;
  return d;
}

const setProjectUpdated = throttle(
  id => db.project.update({ where: { id }, data: { updatedAt: new Date() } }),
  1000 * 60, // 1 min
);

export default router
  .post('/', async (req, res) => {
    const data = req.body;

    let { cid } = decodeToken(getClientToken(req)) ?? {};
    const pid = data.pid;

    // first report
    if (!cid && pid) {
      // check if project exists
      const count = await db.project.count({ where: { id: pid } });
      if (!count) return res.json(null);

      // generate cid
      cid = generateClientId();
      setCookie(res, COOKIE_TOKEN_NAME_CLIENT, encodeToken({ cid }));
    }

    console.log('----report', data, cid);

    if (!cid || !pid || (!data.page && !data.event))
      return res.status(400).send({ ok: false });

    const country = timezoneCity2Country(data.timeZone ?? '');

    if (country) {
      data.country = country;
      delete data.timeZone;
    }

    await db.event.create({
      data: {
        cid,
        project: { connect: { id: pid } },
        data,
      },
    });

    setProjectUpdated();

    res.status(200).send({ ok: true });
  })

  .get('/', async (req, res) => {
    const { startDate, endDate, pid } = req.query;

    const start = normalizeRangeDate(startDate, { isEnd: false });
    const end = normalizeRangeDate(endDate, { isEnd: true });
    if (!pid || !start || !end) return res.status(400).send({ ok: false });

    const events = await db.event.findMany({
      where: {
        pid,
        time: {
          gte: start,
          lte: end,
        },
      },
      select: {
        cid: true,
        data: true,
        time: true,
      },
    });

    // Create days array for the date range
    const daysMap = {};
    const currentDay = new Date(start);

    while (currentDay <= end) {
      const dateKey = currentDay.toISOString().split('T')[0];
      daysMap[dateKey] = {
        pageViews: {},
        events: {},
        usersByCountry: {},
      };
      currentDay.setDate(currentDay.getDate() + 1);
    }

    const report = events.reduce(
      (acc, { cid, data, time }) => {
        const { page, country, event } = data;
        const dateKey = time.toISOString().split('T')[0];

        if (page) {
          acc.pagesViews[page] = (acc.pagesViews[page] ?? 0) + 1;
          acc.totalPageViews++;

          // Add to plot data
          if (daysMap[dateKey]) {
            daysMap[dateKey].pageViews[page] =
              (daysMap[dateKey].pageViews[page] ?? 0) + 1;
          }
        }

        if (event) {
          acc.events[event] = (acc.events[event] ?? 0) + 1;
          acc.totalEvents++;

          // Add to plot data
          if (daysMap[dateKey]) {
            daysMap[dateKey].events[event] =
              (daysMap[dateKey].events[event] ?? 0) + 1;
          }
        }

        if (country) {
          if (!acc.usersByCountry[country])
            acc.usersByCountry[country] = new Set();
          acc.usersByCountry[country].add(cid);

          // Add to plot data
          if (daysMap[dateKey]) {
            if (!daysMap[dateKey].usersByCountry[country]) {
              daysMap[dateKey].usersByCountry[country] = new Set();
            }
            daysMap[dateKey].usersByCountry[country].add(cid);
          }
        }

        return acc;
      },
      {
        usersByCountry: {}, // [country]: {cid, cid, cid}
        pagesViews: {}, // [page]: count
        events: {}, // [event]: count
        totalUsersByCountry: 0,
        totalPageViews: 0,
        totalEvents: 0,
        plotData: {
          pageViews: [],
          events: [],
          usersByCountry: {
            total: [],
          },
        },
      },
    );

    // remove sensitive data, add total
    report.usersByCountry = Object.entries(report.usersByCountry).reduce(
      (acc, [country, users]) => {
        const count = users.size;
        acc[country] = count;
        report.totalUsersByCountry += count;
        return acc;
      },
      {},
    );

    // Convert the daily data for plotting
    report.plotData = {
      pageViews: Object.entries(daysMap).map(([date, dayData]) => ({
        date,
        views: Object.values(dayData.pageViews).reduce(
          (sum, count) => sum + count,
          0,
        ),
        pages: dayData.pageViews,
      })),
      events: Object.entries(daysMap).map(([date, dayData]) => ({
        date,
        count: Object.values(dayData.events).reduce(
          (sum, count) => sum + count,
          0,
        ),
        events: dayData.events,
      })),
      usersByCountry: Object.entries(daysMap).reduce((acc, [date, dayData]) => {
        acc[date] = {};
        Object.entries(dayData.usersByCountry).forEach(([country, users]) => {
          acc[date][country] = users.size;
        });
        return acc;
      }, {}),
    };

    res.json({ report });
  });
