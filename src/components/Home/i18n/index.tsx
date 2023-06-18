import { i18n } from '@homecode/ui';

export default i18n.init({
  ua: () => import('./ua.json'),
  ru: () => import('./ru.json'),
});
