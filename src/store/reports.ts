import { createStore } from 'justorm/react';
import { NotificationsStore } from '@homecode/ui';

import { api } from 'tools/request';
import { i18n } from 'tools/i18n';

export const buildInterval = (startDate: string, endDate: string) =>
  `${startDate}-${endDate}`;

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
};

const STORE = createStore('reports', {
  items: {} as { [interval: string]: Report },

  async load(data: RequestParams) {
    const { pid } = data;
    const res = await api.get('/report', { data });
    const { startDate, endDate } = data;
    const interval = buildInterval(startDate, endDate);

    if (!this.items[pid]) this.items[pid] = {};
    if (!this.items[pid][interval]) this.items[pid][interval] = {};

    this.items[pid][interval] = res.report;
  },
});

export default STORE;
