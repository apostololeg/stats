import React from 'react';
import ReactDOM from 'react-dom/client';

import App from 'components/App/App';

if (PRODUCTION) {
  import('./pwa');
  // import('@sentry/react').then(Sentry => Sentry.init({ dsn: SENTRY_DSN }));
}

const root = ReactDOM.createRoot(document.getElementById('app-root'));

root.render(React.createElement(App));
