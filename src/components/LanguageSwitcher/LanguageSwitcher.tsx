import { useCallback, useEffect, useState } from 'react';
import { withStore } from 'justorm/react';
import { Select } from '@homecode/ui';

import moment from 'moment';
// @ts-ignore
import ruLocale from 'moment/locale/ru';
// @ts-ignore
import uaLocale from 'moment/locale/uk';

import { LANG_OPTIONS, i18n } from 'tools/i18n';

export default function LanguageSwitcher(props) {
  return (
    <Select
      size="l"
      {...props}
      options={LANG_OPTIONS}
      required
      hideRequiredStar
    />
  );
}

export const UILanguageSwitcher = withStore({
  i18n: 'lang',
})(function UILanguageSwitcher({ store, ...rest }) {
  const { lang } = store.i18n;

  useEffect(() => {
    moment.locale(lang === 'ua' ? 'uk' : lang, [ruLocale, uaLocale]);
  }, [lang]);

  return (
    <LanguageSwitcher
      label={i18n('Language')}
      {...rest}
      value={lang}
      onChange={store.i18n.changeLang}
    />
  );
});
