require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const FALLBACK_PROJECTS = [
  { name: 'GLASS', domain: 'glass.cat/' },
  { name: 'BestHumans', domain: 'besthumans.app/' },
  { name: 'sandbox', domain: 'sandbox.local/' },
  { name: 'scores.cat', domain: 'scores.cat/' },
  { name: 'Shaping', domain: 'shaping.app/' },
];

const PROJECT_TRAFFIC = {
  GLASS: {
    pages: ['/', '/calls', '/chats', '/settings', '/dashboard', '/contacts'],
    events: ['call_started', 'call_ended', 'message_sent', 'signup', 'login'],
  },
  BestHumans: {
    pages: ['/', '/jobs', '/candidates', '/pipeline', '/settings'],
    events: ['apply', 'interview_booked', 'hire', 'signup', 'login'],
  },
  sandbox: {
    pages: ['/', '/demo', '/playground', '/docs'],
    events: ['click_cta', 'signup', 'feature_flag', 'error'],
  },
  'scores.cat': {
    pages: ['/', '/scores', '/live', '/about', '/leaderboard'],
    events: ['score_submit', 'share', 'signup', 'click_cta', 'download'],
  },
  Shaping: {
    pages: ['/', '/board', '/projects', '/settings'],
    events: ['task_created', 'comment', 'signup', 'login'],
  },
};

const COUNTRIES = [
  'Ukraine',
  'Portugal',
  'United States',
  'Germany',
  'United Kingdom',
  'Poland',
  'Spain',
  'France',
  'Netherlands',
  'Brazil',
  'Canada',
  'Japan',
];

const CLIENT_IDS = [
  'A1B2C3D4',
  'E5F6G7H8',
  'J9K0L1M2',
  'N3P4Q5R6',
  'S7T8U9V0',
  'W1X2Y3Z4',
  'B5C6D7E8',
  'F9G0H1J2',
  'K3L4M5N6',
  'P7Q8R9S0',
  'T1U2V3W4',
  'X5Y6Z7A8',
  'C9D0E1F2',
  'G3H4J5K6',
  'L7M8N9P0',
];

function mulberry32(seed) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rng, list) {
  return list[Math.floor(rng() * list.length)];
}

function trafficFor(project) {
  const key = project.name.trim();
  return PROJECT_TRAFFIC[key] || PROJECT_TRAFFIC.GLASS;
}

function makeEvent(rng, project, time) {
  const traffic = trafficFor(project);
  const isPage = rng() < 0.7;
  const cid = pick(rng, CLIENT_IDS);
  const country = pick(rng, COUNTRIES);
  const data = {
    pid: project.id,
    country,
    seed: true,
  };

  if (isPage) data.page = pick(rng, traffic.pages);
  else data.event = pick(rng, traffic.events);

  return { cid, pid: project.id, time, data };
}

function buildTimes(now) {
  const times = [];
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  for (let d = new Date(threeMonthsAgo); d < now; d.setDate(d.getDate() + 1)) {
    const day = new Date(d);
    const ageDays = (now - day) / 86400000;
    const recencyBoost = ageDays < 14 ? 2 : ageDays < 45 ? 1 : 0;
    const weekday = day.getDay();
    const weekendPenalty = weekday === 0 || weekday === 6 ? -1 : 0;
    const count = 3 + recencyBoost + weekendPenalty;

    for (let i = 0; i < count; i++) {
      const t = new Date(day);
      t.setHours(8 + Math.floor((i * 12) / count), (i * 17) % 60, i % 60, 0);
      times.push(t);
    }
  }

  for (let i = 0; i < 40; i++) {
    times.push(new Date(now.getTime() - i * 90 * 1000));
  }

  times.push(new Date(now));
  return times;
}

async function ensureProjects() {
  const existing = await prisma.project.findMany({
    select: { id: true, name: true, domain: true },
  });
  const byName = new Map(existing.map(p => [p.name.trim(), p]));

  for (const data of FALLBACK_PROJECTS) {
    if (!byName.has(data.name)) {
      const created = await prisma.project.create({ data });
      byName.set(data.name, created);
    }
  }

  return [...byName.values()];
}

async function main() {
  const projects = await ensureProjects();
  const rng = mulberry32(20260820);
  const now = new Date();
  const times = buildTimes(now);

  const events = times.map(time => makeEvent(rng, pick(rng, projects), time));

  await prisma.$executeRaw`DELETE FROM "Event" WHERE data->>'seed' = 'true'`;

  const BATCH = 500;
  for (let i = 0; i < events.length; i += BATCH) {
    await prisma.event.createMany({ data: events.slice(i, i + BATCH) });
  }

  const [eventCount, seededCount, latest] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({
      where: { data: { path: ['seed'], equals: true } },
    }),
    prisma.event.findFirst({
      orderBy: { time: 'desc' },
      select: { time: true },
    }),
  ]);

  console.log(
    JSON.stringify(
      {
        projects: projects.map(p => p.name.trim()),
        inserted: events.length,
        seededCount,
        eventCount,
        latest: latest?.time,
      },
      null,
      2,
    ),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
