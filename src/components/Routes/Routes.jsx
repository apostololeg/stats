import { withStore } from 'justorm/react';

import { Router, Route, Redirect, Lazy } from '@homecode/ui';

import NoMatch from './NoMatch';

export default withStore({
  user: ['id', 'isInited', 'isLogged', 'permissions'],
})(function Routes({ store }) {
  const { isInited, isLogged, permissions } = store.user;

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
});
