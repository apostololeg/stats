import express from 'express';

import { COOKIE_TOKEN_NAME_CLIENT } from '../../config/const';

import db from '../api/db';
import { encodeToken, decodeToken, setCookie } from '../api/auth';

import throttle from '../tools/throttle';
import { getClientToken, generateClientId } from '../tools/tokens';
import { timezoneCity2Country } from '../tools/timezoneCity2Country';

// import { adminMidleware } from './auth';

const router = express.Router();

const setProjectUpdated = throttle(
  id => db.project.update({ where: { id }, data: { updatedAt: new Date() } }),
  1000 * 60 // 1 min
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

    const events = await db.event.findMany({
      where: {
        pid,
        time: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        cid: true,
        data: true,
        time: true,
      },
    });

    // Create days array for the date range
    const start = new Date(startDate);
    const end = new Date(endDate);
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
      }
    );

    // remove sensitive data, add total
    report.usersByCountry = Object.entries(report.usersByCountry).reduce(
      (acc, [country, users]) => {
        const count = users.size;
        acc[country] = count;
        report.totalUsersByCountry += count;
        return acc;
      },
      {}
    );

    // Convert the daily data for plotting
    report.plotData = {
      pageViews: Object.entries(daysMap).map(([date, dayData]) => ({
        date,
        views: Object.values(dayData.pageViews).reduce(
          (sum, count) => sum + count,
          0
        ),
        pages: dayData.pageViews,
      })),
      events: Object.entries(daysMap).map(([date, dayData]) => ({
        date,
        count: Object.values(dayData.events).reduce(
          (sum, count) => sum + count,
          0
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
