import { WebSocketServer } from 'ws';

import { ADMIN_KEY, COOKIE_TOKEN_NAME, PRODUCTION } from '../../config/const';
import { decodeToken } from '../api/auth';
import db from '../api/db';

const LIVE_PATH = '/api/live';
const clients = new Set();

function parseCookie(header, name) {
  if (!header) return null;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function isAdminRequest(req) {
  if (!PRODUCTION) return true;

  const token = parseCookie(req.headers.cookie, COOKIE_TOKEN_NAME);
  if (!token) return false;

  return decodeToken(token)?.key === ADMIN_KEY;
}

export function serializeEvent({ id, cid, pid, time, data }) {
  return {
    id,
    cid,
    pid,
    time: time.toISOString(),
    data: {
      page: data?.page,
      event: data?.event,
      country: data?.country,
    },
  };
}

async function sendHistory(ws) {
  const events = await db.event.findMany({
    orderBy: { time: 'desc' },
    take: 100,
    select: { id: true, cid: true, pid: true, time: true, data: true },
  });

  ws.send(
    JSON.stringify({
      type: 'history',
      events: events.map(serializeEvent),
    }),
  );
}

export function broadcastLiveEvent(event) {
  const payload = JSON.stringify({
    type: 'event',
    event: serializeEvent(event),
  });

  clients.forEach(ws => {
    if (ws.readyState === ws.OPEN) ws.send(payload);
  });
}

export function setupLiveWs(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    if (pathname !== LIVE_PATH) return;

    if (!isAdminRequest(req)) {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit('connection', ws, req);
    });
  });

  wss.on('connection', ws => {
    clients.add(ws);

    sendHistory(ws).catch(err => {
      console.error('Live WS history error:', err);
      ws.close();
    });

    ws.on('close', () => clients.delete(ws));
    ws.on('error', () => clients.delete(ws));
  });
}
