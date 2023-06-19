(() => {
  const url = '{DOMAIN}/report';
  let page = window.location.pathname;

  let resolveInit;
  const initPromise = new Promise(resolve => (resolveInit = resolve));

  const report = async data => {
    await initPromise;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      // credentials: 'same-origin',
    });
  };

  const reportPage = async e => {
    const { pathname } = e.target.location;
    if (pathname === page) return;
    page = pathname;
    report({ page });
  };

  const init = async () => {
    const { timeZone } = Intl?.DateTimeFormat().resolvedOptions() ?? {};
    const params = { page, timeZone };

    report(params);
    resolveInit();
  };

  document.addEventListener('pushstate', reportPage);
  document.addEventListener('popstate', reportPage);

  init();
})();
