(() => {
  let page = window.location.pathname;

  const pid = document
    .querySelector(`[src*="/client?pid="]`)
    ?.getAttribute('src')
    ?.split('?pid=')[1];

  if (!pid) {
    console.error('Stats: Wrong configuration. Project ID not found');
    return;
  }

  const iframe = document.createElement('iframe');

  const report = async data => {
    iframe.contentWindow.postMessage(
      { type: 'stats', pid, ...data },
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

  const { timeZone } = Intl?.DateTimeFormat().resolvedOptions() ?? {};

  iframe.src = '{DOMAIN}/api/client/iframe';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  window.addEventListener('message', e => {
    if (e.data.type === 'stats-inited') {
      report({ page, timeZone });
      const pushState = window.history.pushState;
      const replaceState = window.history.replaceState;

      history.pushState = function (state, title, url) {
        var pushEvent = new CustomEvent('pushstate', {
          detail: { state, url },
        });
        window.dispatchEvent(pushEvent);
        return pushState.apply(history, arguments);
      };

      history.replaceState = function (state, title, url) {
        var replaceEvent = new CustomEvent('replacestate', {
          detail: { state, url },
        });
        window.dispatchEvent(replaceEvent);
        return replaceState.apply(history, arguments);
      };

      window.addEventListener('pushstate', reportPage);
      window.addEventListener('replacestate', reportPage);
      window.addEventListener('popstate', reportPage);
    }
  });
})();
