import { createStore, useStore } from 'justorm/react';

import { api } from 'tools/request';

const STORE = createStore('projects', {
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

export type ProjectsStore = typeof STORE;
export default STORE;

export const useProjects = (
  fields: (keyof ProjectsStore)[] = []
): ProjectsStore => {
  const store = useStore<{ projects: ProjectsStore }>({ projects: fields });
  return store.projects;
};
