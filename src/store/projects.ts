import { createStore } from 'justorm/react';

import { api } from 'tools/request';

export default createStore('projects', {
  items: [],

  async load() {
    const res = await api.get('/project');

    this.items.push(...res.projects);
  },

  async add(name) {
    const res = await api.post('/project', { data: { name } });

    this.items.push(res.project);
  },
});
