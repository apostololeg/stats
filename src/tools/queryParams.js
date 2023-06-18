import qs from 'qs';

export function stringify(params) {
  if (!params || !Object.entries(params).length) return '';
  return `?${qs.stringify(params)}`;
}
