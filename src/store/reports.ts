import { LS } from '@homecode/ui';

import { createStore } from 'justorm/react';
import { api } from 'tools/request';

export const buildInterval = (startDate: string, endDate: string) =>
  `${startDate}_${endDate}`;

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

function toRangeDateString(date: string, isEnd: boolean) {
  if (!DATE_ONLY_RE.test(date)) return date;
  return `${date}T${isEnd ? '23:59:59.999' : '00:00:00.000'}Z`;
}

export type RequestParams = {
  pid: string;
  startDate: string;
  endDate: string;
};

export type Report = {
  pid: string;
  startDate: string;
  endDate: string;

  usersByCountry: { [country: string]: number }; // users by country
  pagesViews: { [page: string]: number }; // pages views
  events: { [event: string]: number };

  totalUsersByCountry: number;
  totalPageViews: number;
  totalEvents: number;

  plotData: {
    usersByCountry: { [country: string]: number };
    pageViews: { [page: string]: { date: string; views: number } };
    events: { [event: string]: { date: string; count: number } };
  };
};

const STORE = createStore('reports', {
  items: {} as { [interval: string]: Report },

  isLoadingByInterval: {} as { [interval: string]: boolean },

  async load(data: RequestParams, force = false) {
    const { pid, startDate: startDateRaw, endDate: endDateRaw } = data;
    const interval = buildInterval(startDateRaw, endDateRaw);

    if (!this.items[pid]) this.items[pid] = {};

    // try get from cache
    const lsKey = `report-${pid}-${interval}`;
    const cachedReport = LS.get(lsKey);
    if (cachedReport && !force) {
      this.items[pid][interval] = cachedReport;
      return;
    }

    // load from server
    this.isLoadingByInterval[interval] = true;
    const res = await api.get('/report', {
      data: {
        pid,
        startDate: toRangeDateString(startDateRaw, false),
        endDate: toRangeDateString(endDateRaw, true),
      },
    });

    this.items[pid][interval] = res.report;
    LS.set(lsKey, res.report);

    this.isLoadingByInterval[interval] = false;
  },
});

export default STORE;
