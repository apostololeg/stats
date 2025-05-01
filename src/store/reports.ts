import { LS } from '@homecode/ui';
import { createStore } from 'justorm/react';

import { api } from 'tools/request';

export const buildInterval = (startDate: string, endDate: string) =>
  `${startDate}_${endDate}`;

export type RequestParams = {
  pid: string;
  startDate: string;
  endDate: string;
};

export type Report = {
  startDate: string;
  endDate: string;
  pid: string;
  countries: { [country: string]: number };
  pages: { [page: string]: number };
  users: { [user: string]: number };
  events: { [event: string]: number };
};

const STORE = createStore('reports', {
  items: {} as { [interval: string]: Report },

  isLoadingByInterval: {} as { [interval: string]: boolean },

  async load(data: RequestParams) {
    const { pid, startDate, endDate } = data;
    const interval = buildInterval(startDate, endDate);

    if (!this.items[pid]) this.items[pid] = {};

    // try get from cache
    const lsKey = `report-${pid}-${interval}`;
    const cachedReport = LS.get(lsKey);
    if (cachedReport) {
      this.items[pid][interval] = cachedReport;
      return;
    }

    // load from server
    this.isLoadingByInterval[interval] = true;
    const res = await api.get('/report', { data });

    this.items[pid][interval] = res.report;
    LS.set(lsKey, res.report);

    this.isLoadingByInterval[interval] = false;
  },
});

export default STORE;
