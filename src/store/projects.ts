import { createStore } from 'justorm/react';

import { api } from 'tools/request';

export default createStore('projects', {
  items: [],

  loadingByPid: {},

  async load(pid: string) {
    if (this.loadingByPid[pid]) {
      return;
    }

    this.loadingByPid[pid] = true;

    const res = await api.get('/project');

    this.items.push(...res.projects);

    this.loadingByPid[pid] = false;
  },

  async add(data) {
    const res = await api.post('/project', { data });

    this.items.push(res.project);
  },
});
