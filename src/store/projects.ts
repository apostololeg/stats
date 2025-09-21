import { createStore, useStore } from 'justorm/react';
import { api } from 'tools/request';

export type Project = {
  id: string;
  name: string;
  domain: string;
};

const STORE = createStore('projects', {
  items: [] as Project[],

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

  async upsert(data) {
    const res = await api.post('/project', { data });
    const index = this.items.findIndex(item => item.id === res.project.id);

    if (index !== -1) {
      this.items = [
        ...this.items.slice(0, index),
        res.project,
        ...this.items.slice(index + 1),
      ];
    } else {
      this.items.push(res.project);
    }
  },

  async delete(id: string) {
    const res = await api.delete(`/project/${id}`);

    if (res.ok) {
      this.items = this.items.filter(item => item.id !== id);
    }
  },
});

export type ProjectsStore = typeof STORE;
export default STORE;

export const useProjects = (
  fields: (keyof ProjectsStore)[] = [],
): ProjectsStore => {
  const store = useStore<{ projects: ProjectsStore }>({ projects: fields });
  return store.projects;
};

export const useProject = (id: string): Project => {
  const store = useStore<{ projects: ProjectsStore }>({ projects: ['items'] });
  return store.projects.items.find(item => item.id === id);
};
