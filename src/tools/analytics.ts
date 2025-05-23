export const reportEvent = (event: string) => {
  // @ts-ignore
  window.statsSDK?.report({ event });
};
