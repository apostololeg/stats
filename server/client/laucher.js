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

  const report = async data => {
    window.postMessage({ type: 'stats', pid, ...data });
  };

  const reportPage = async e => {
    const { pathname } = e.target.location;
    if (pathname === page) return;
    page = pathname;
    report({ page });
  };

  const { timeZone } = Intl?.DateTimeFormat().resolvedOptions() ?? {};

  const iframe = document.createElement('iframe');

  iframe.src = '{DOMAIN}/api/client/iframe';
  iframe.style.display = 'none';
  iframe.onload = () => {
    setTimeout(() => {
      report({ page, timeZone });
      document.addEventListener('pushstate', reportPage, true);
      document.addEventListener('popstate', reportPage, true);
    }, 100);
  };

  document.body.appendChild(iframe);
})();
