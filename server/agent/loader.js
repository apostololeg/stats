(() => {
  let page = window.location.pathname;

  const iframe = document.createElement('iframe');

  const prjAttr = 'data-stats-projectId';
  const projectId = document
    .querySelector(`[${prjAttr}]`)
    ?.getAttribute(prjAttr);

  if (!projectId) {
    console.error('Stats: Wrong configuration. Project ID not found');
    return;
  }

  const report = data => iframe.contentWindow.postMessage(data, '{DOMAIN}');

  const reportPage = async e => {
    const { pathname } = e.target.location;
    if (pathname === page) return;
    page = pathname;
    report({ page });
  };

  const onLoad = () => {
    const { timeZone } = Intl?.DateTimeFormat().resolvedOptions() ?? {};

    report({ projectId, page, timeZone });

    document.addEventListener('pushstate', reportPage, true);
    document.addEventListener('popstate', reportPage, true);
  };

  iframe.src = `{DOMAIN}/api/agent/iframe`;
  iframe.style.display = 'none';
  iframe.onload = onLoad;
  document.body.appendChild(iframe);
})();
