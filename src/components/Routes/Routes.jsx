import { useStore } from 'justorm/react';

import { Router, Route, Redirect, Lazy } from '@homecode/ui';

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

      <Route component={NoMatch} />
    </Router>
  );
}
