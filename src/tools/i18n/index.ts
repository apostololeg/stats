import { i18n as i18nService, LS } from '@homecode/ui';

const langsModules = {
  en: {}, // English texts already in source code
  // ua: () => import('./ua.json'),
  ru: () => import('./ru.json'),
};

const api = i18nService.init(langsModules);

export const langs = Object.keys(langsModules);
export const DEFAULT_LANG = 'en';

export const i18n = api.i18n;
export const I18N = api.I18N;
export const withI18N = api.withI18N;

export const LANG_OPTIONS = [
  { id: 'en', label: 'English' },
  // { id: 'ua', label: 'Українська' },
  { id: 'ru', label: 'Русский' },
];

const getInitialLang = () => {
  const lsLang = LS.get('lang');
  if (lsLang) return lsLang;

  const lang = navigator.language;
  if (lang.startsWith('uk')) return 'ua';
  if (lang.startsWith('ru')) return 'ru';
  return 'en';
};

i18nService.store.changeLang(getInitialLang());
