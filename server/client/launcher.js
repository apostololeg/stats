(() => {
  let page = window.location.pathname;
  const origin = window.location.origin;

  const pid = document
    .querySelector(`[src*="/client?pid="]`)
    ?.getAttribute('src')
    ?.split('?pid=')[1];

  if (!pid) {
    console.error('Stats: Wrong configuration. Project ID not found');
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.src = '{DOMAIN}/api/client/iframe';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const report = async data => {
    iframe.contentWindow.postMessage(
      { type: 'stats', ...data, pid, origin },
      '{DOMAIN}'
    );
  };

  const reportPage = async e => {
    let url = e.detail.url.split('?')[0];

    if (url === '') url = '/';
    if (url === page) return;
    page = url;
    report({ page });
  };

  const watchBrowserHistory = () => {
    const pushState = window.history.pushState;
    const replaceState = window.history.replaceState;

    const createEvent = (type, state, url) =>
      new CustomEvent(type, { detail: { state, url } });

    history.pushState = function (state, title, url) {
      window.dispatchEvent(createEvent('pushstate', state, url));
      return pushState.apply(history, arguments);
    };

    history.replaceState = function (state, title, url) {
      window.dispatchEvent(createEvent('replacestate', state, url));
      return replaceState.apply(history, arguments);
    };

    const onPopState = () =>
      reportPage({ detail: { url: window.location.pathname } });

    window.addEventListener('pushstate', reportPage);
    window.addEventListener('replacestate', reportPage);
    window.addEventListener('popstate', onPopState);
  };

  const { timeZone } = Intl?.DateTimeFormat().resolvedOptions() ?? {};

  window.addEventListener('message', e => {
    if (e.data.type === 'stats-inited') {
      report({ page, timeZone });
      watchBrowserHistory();
      return;
    }
  });

  window.statsSDK = {
    report,
    reportPage,
    timeZone,
  };
})();
