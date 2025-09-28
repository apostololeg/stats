import React from 'react';
import ReactDOM from 'react-dom/client';

import App from 'components/App/App';

if (PRODUCTION) {
  import('./pwa');
}

const root = ReactDOM.createRoot(document.getElementById('app-root'));

root.render(React.createElement(App));
