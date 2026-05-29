import { Lazy, Redirect, Route, Router } from '@homecode/ui';

import { useStore } from 'justorm/react';

import NoMatch from './NoMatch';

export default function Routes() {
  // const { user } = useStore({
  //   user: ['id', 'isInited', 'isLogged', 'permissions'],
  // });
  // const { isInited, isLogged, permissions } = user;

  // if (!isInited) return <PageLoader size="l" />;

  return (
    <Router single>
      <Route
        path="/"
        exact
        component={Lazy}
        loader={() => import('components/Home/Home')}
      />

      <Route
        path="/project/:pid"
        component={Lazy}
        loader={() => import('components/Project/Project')}
      />

      <Route
        path="/live"
        component={Lazy}
        loader={() => import('components/Live/Live')}
      />

      <Route component={NoMatch} />
    </Router>
  );
}
