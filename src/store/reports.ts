import { createStore } from 'justorm/react';
import { NotificationsStore } from '@homecode/ui';

import { api } from 'tools/request';
import { i18n } from 'tools/i18n';

export const buildInterval = (startDate: string, endDate: string) =>
  `${startDate}-${endDate}`;

export type RequestParams = {
  projectId: string;
  startDate: string;
  endDate: string;
};

export type Report = {
  startDate: string;
  endDate: string;
  projectId: string;
  countries: { [country: string]: number };
  pages: { [page: string]: number };
};

const STORE = createStore('reports', {
  items: {} as { [interval: string]: Report },

  async load(data: RequestParams) {
    const { projectId } = data;
    const res = await api.get('/report', { data });
    const { startDate, endDate } = data;
    const interval = buildInterval(startDate, endDate);

    if (!this.items[projectId]) this.items[projectId] = {};
    if (!this.items[projectId][interval]) this.items[projectId][interval] = {};

    this.items[projectId][interval] = res.report;
  },
});

export default STORE;
