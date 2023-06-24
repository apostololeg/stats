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
    fetch('/api/report', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  };
  const reportPage = async e => {
    const { pathname } = e.target.location;
    if (pathname === page) return;
    page = pathname;
    report({ page });
  };

  const { timeZone } = Intl?.DateTimeFormat().resolvedOptions() ?? {};

  report({ pid, page, timeZone });

  document.addEventListener('pushstate', reportPage, true);
  document.addEventListener('popstate', reportPage, true);
})();
