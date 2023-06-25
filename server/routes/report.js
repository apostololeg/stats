import express from 'express';

import db from '../api/db';
import { decodeToken, setCookie } from '../api/auth';

import throttle from '../tools/throttle';
import { getClientToken } from '../tools/tokens';
import { timezoneCity2Country } from '../tools/timezoneCity2Country';

// import { adminMidleware } from './auth';

const router = express.Router();

const setProjectUpdated = throttle(
  id => db.project.update({ where: { id }, data: { updatedAt: new Date() } }),
  1000 * 10 // 10 seconds
);

router
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
      },
    });

    const report = events.reduce(
      (acc, { cid, data }) => {
        const { page, country } = data;

        acc.users.add(cid);

        if (page) acc.pages[page] = (acc.pages[page] ?? 0) + 1;

        if (country) {
          if (!acc.countries[country]) acc.countries[country] = new Set();
          acc.countries[country].add(cid);
        }

        return acc;
      },
      {
        pages: {}, // [page]: count
        countries: {}, // [country]: {cid, cid, cid}
        users: new Set(), // [cid]: count
      }
    );

    report.users = report.users.size;

    report.countries = Object.entries(report.countries).reduce(
      (acc, [country, users]) => ({
        ...acc,
        [country]: users.size,
      }),
      {}
    );

    res.json({ report });
  })

  .post('/', async (req, res) => {
    const data = req.body;

    let { cid } = decodeToken(getClientToken(req)) ?? {};
    let pid = data.pid;

    // first report
    if (!cid && pid) {
      // check if project exists
      const count = await db.project.count({ where: { id: pid } });
      if (!count) return res.json(null);

      // generate cid
      cid = generateClientId();
      setCookie(res, COOKIE_TOKEN_NAME_CLIENT, encodeToken({ cid }));
    }

    console.log('----report', data, cid, pid);

    if (!cid || !pid || !data.page) return res.status(400).send({ ok: false });

    if (data.timeZone) {
      const country = timezoneCity2Country(data.timeZone);

      if (country) {
        data.country = country;
        delete data.timeZone;
      }
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
  });

export default router;
