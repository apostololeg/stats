import runtime from '@lcdp/offline-plugin/runtime';

import app from 'components/App/store';

runtime.install({
  onUpdating() {
    console.log('SW Event:', 'onUpdating');
  },
  onUpdateReady() {
    console.log('SW Event:', 'onUpdateReady');
    app.setUpdater(() => runtime.applyUpdate());
  },
  onUpdated() {
    console.log('SW Event:', 'onUpdated');
    // Reload the webpage to load into the new version
    location.reload();
  },
  onUpdateFailed() {
    console.log('SW Event:', 'onUpdateFailed');
  },
});
