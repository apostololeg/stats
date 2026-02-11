(function (pid) {
  const API_URL = __STATS_API_URL__;
  const K = 'stats-token';

  function getTimeZone() {
    return (
      (
        typeof Intl !== 'undefined' &&
        Intl.DateTimeFormat?.().resolvedOptions?.()
      )?.timeZone ?? ''
    );
  }

  function send(p, data) {
    const token =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(K + '-' + p)
        : null;
    const body = { pid: p, ...data };
    if (token) body.token = token;

    fetch(API_URL + '/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(res => res.text())
      .then(t => {
        let d = {};
        if (t)
          try {
            d = JSON.parse(t);
          } catch (e) {}
        if (d.token && typeof localStorage !== 'undefined') {
          localStorage.setItem(K + '-' + p, d.token);
        }
      });
  }

  function watchHistory(reportPageCb) {
    const pushState = history.pushState;
    const replaceState = history.replaceState;
    history.pushState = function (...args) {
      window.dispatchEvent(
        new CustomEvent('pushstate', {
          detail: { state: args[0], url: args[2] },
        }),
      );
      return pushState.apply(history, args);
    };
    history.replaceState = function (...args) {
      window.dispatchEvent(
        new CustomEvent('replacestate', {
          detail: { state: args[0], url: args[2] },
        }),
      );
      return replaceState.apply(history, args);
    };
    const onPopState = () =>
      reportPageCb({ detail: { url: location.pathname } });
    window.addEventListener('pushstate', reportPageCb);
    window.addEventListener('replacestate', reportPageCb);
    window.addEventListener('popstate', onPopState);
  }

  let page = location.pathname;
  const reportPageCb = e => {
    let url = ((e && e.detail && e.detail.url) || location.pathname).split(
      '?',
    )[0];
    if (url === '') url = '/';
    if (url === page) return;
    page = url;
    send(pid, { page, timeZone: getTimeZone() });
  };
  const s = {
    reportPage(p) {
      send(pid, { page: p || location.pathname, timeZone: getTimeZone() });
    },
    reportEvent(event) {
      send(pid, { event });
    },
  };
  watchHistory(reportPageCb);
  s.reportPage();
  window.statsSDK = {
    report: e => e && s.reportEvent(e),
    reportPage: () => s.reportPage(),
  };
})('__STATS_PID__');
