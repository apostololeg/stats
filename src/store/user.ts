import { LS } from '@homecode/ui';

import { createStore, useStore } from 'justorm/react';
import { api } from 'tools/request';

const STORE = createStore('user', {
  isInited: false,
  isLoginProgress: false,
  isLogged: !!LS.get('isLogged'),

  async init() {
    if (this.isInited) return;

    if (!this.isLogged) {
      this.isInited = true;
      return;
    }

    try {
      await api.get('/auth/check');
    } catch {
      this.isLogged = false;
      LS.remove('isLogged');
    } finally {
      this.isInited = true;
    }
  },

  async login(key, cb?: (isLogged: boolean) => void) {
    try {
      this.isLoginProgress = true;
      await api.get(`/auth/${key}`); // set cookie

      this.isLogged = true;
      LS.set('isLogged', true);
    } finally {
      this.isLoginProgress = false;
      cb?.(this.isLogged);
    }
  },
});

export type UserStore = typeof STORE;
export default STORE;

export const useUser = (fields: (keyof UserStore)[] = []) => {
  const store = useStore<{ user: UserStore }>({ user: fields });
  return store.user;
};
