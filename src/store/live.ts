import { createStore, useStore } from 'justorm/react';
import { api } from 'tools/request';

const MAX_EVENTS = 500;
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;

export type LiveEventData = {
  page?: string;
  event?: string;
  country?: string;
};

export type LiveEvent = {
  id: string;
  cid: string;
  pid: string;
  time: string;
  data: LiveEventData;
};

export type LiveStatus = 'idle' | 'connecting' | 'connected' | 'disconnected';

export type LiveFilterOptions = {
  time: string[];
  country: string[];
  project: { id: string; name: string }[];
  type: string[];
  name: string[];
  client: string[];
};

const EMPTY_FILTER_OPTIONS: LiveFilterOptions = {
  time: [],
  country: [],
  project: [],
  type: ['page', 'event'],
  name: [],
  client: [],
};

type LiveMessage =
  | { type: 'history'; events: LiveEvent[] }
  | { type: 'event'; event: LiveEvent };

const STORE = createStore('live', {
  events: [] as LiveEvent[],
  status: 'idle' as LiveStatus,
  filterOptions: null as LiveFilterOptions | null,

  _ws: null as WebSocket | null,
  _loadingFilterOptions: false,
  _reconnectTimer: null as ReturnType<typeof setTimeout> | null,
  _reconnectDelay: RECONNECT_BASE_MS,
  _shouldReconnect: false,

  connect() {
    if (this._ws) return;

    this._shouldReconnect = true;
    this.status = 'connecting';

    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${location.host}/api/live`);

    this._ws = ws;

    ws.onopen = () => {
      this.status = 'connected';
      this._reconnectDelay = RECONNECT_BASE_MS;
    };

    ws.onmessage = ({ data }) => {
      try {
        const msg = JSON.parse(data as string) as LiveMessage;

        if (msg.type === 'history') {
          this.events = msg.events.slice(0, MAX_EVENTS);
        } else if (msg.type === 'event') {
          this.events = [msg.event, ...this.events].slice(0, MAX_EVENTS);
        }
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      this._ws = null;
      this.status = this._shouldReconnect ? 'disconnected' : 'idle';
      this.scheduleReconnect();
    };

    ws.onerror = () => {
      ws.close();
    };
  },

  disconnect() {
    this._shouldReconnect = false;
    this.clearReconnectTimer();

    if (this._ws) {
      this._ws.close();
      this._ws = null;
    }

    this.status = 'idle';
  },

  scheduleReconnect() {
    if (!this._shouldReconnect) return;

    this.clearReconnectTimer();
    this._reconnectTimer = setTimeout(() => {
      this._reconnectTimer = null;
      if (!this._shouldReconnect || this._ws) return;
      this.connect();
      this._reconnectDelay = Math.min(
        this._reconnectDelay * 2,
        RECONNECT_MAX_MS,
      );
    }, this._reconnectDelay);
  },

  clearReconnectTimer() {
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer);
      this._reconnectTimer = null;
    }
  },

  async loadFilterOptions() {
    if (this.filterOptions || this._loadingFilterOptions) return;

    this._loadingFilterOptions = true;

    try {
      this.filterOptions = await api.get('/live/filters');
    } catch {
      this.filterOptions = EMPTY_FILTER_OPTIONS;
    } finally {
      this._loadingFilterOptions = false;
    }
  },
});

export type LiveStore = typeof STORE;
export default STORE;

export const useLive = (fields: (keyof LiveStore)[] = []) => {
  const store = useStore<{ live: LiveStore }>({ live: fields });
  return store.live;
};
