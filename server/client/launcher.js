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
    const { pathname } = e.target.location;
    if (pathname === page) return;
    page = pathname;
    report({ page });
  };

  const { timeZone } = Intl?.DateTimeFormat().resolvedOptions() ?? {};

  iframe.src = '{DOMAIN}/api/client/iframe';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  window.addEventListener('message', e => {
    if (e.data.type === 'stats-inited') {
      report({ page, timeZone });
      document.addEventListener('pushstate', reportPage, true);
      document.addEventListener('popstate', reportPage, true);
    }
  });
})();
