import { createStore } from 'justorm/react';
import { LS } from '@homecode/ui';

import { api } from 'tools/request';

const STORE = createStore('user', {
  isInited: false,
  isLoginProgress: false,
  isLogged: !!LS.get('isLogged'),

  async login(key) {
    try {
      this.isLoginProgress = true;
      await api.get(`/auth/${key}`); // set cookie

      this.isLogged = true;
      LS.set('isLogged', true);
    } finally {
      this.isLoginProgress = false;
    }
  },
});

export default STORE;
