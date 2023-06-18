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

  const getCountry = async () => {
    const LS_COUTRY = 'country';
    const LS_COUTRY_TIME = 'countryTime';
    let country = localStorage.getItem(LS_COUTRY);
    const countryTime = localStorage.getItem(LS_COUTRY_TIME);

    if (!country || Date.now() - countryTime > 1000 * 60 * 60 * 1) {
      const ipRes = await fetch('{PROTOCOL}ip-api.com/json/?fields=country');
      const res = await ipRes.json();

      country = res.country;

      localStorage.setItem(LS_COUTRY, country);
      localStorage.setItem(LS_COUTRY_TIME, Date.now());
    }

    return country;
  };

  const init = async () => {
    const params = { page };

    params.country = await getCountry();
    report(params);
    resolveInit();
  };

  document.addEventListener('pushstate', reportPage);
  document.addEventListener('popstate', reportPage);

  init();
})();
