import { createStore } from 'justorm/react';

import { api } from 'tools/request';

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

  isLoading: false,

  async load(data: RequestParams) {
    this.isLoading = true;

    const { pid } = data;
    const res = await api.get('/report', { data });
    const { startDate, endDate } = data;
    const interval = buildInterval(startDate, endDate);

    if (!this.items[pid]) this.items[pid] = {};
    if (!this.items[pid][interval]) this.items[pid][interval] = {};

    this.items[pid][interval] = res.report;
    this.isLoading = false;
  },
});

export default STORE;
