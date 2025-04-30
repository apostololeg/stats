import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'justorm/react';
import { Select, i18n as i18nService } from '@homecode/ui';

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

type Store = {
  i18n: typeof i18nService.store;
};

export const UILanguageSwitcher = function UILanguageSwitcher({ ...rest }) {
  const { i18n: i18nStore } = useStore<Store>({
    i18n: ['lang'],
  });
  const { lang } = i18nStore;

  useEffect(() => {
    moment.locale(lang === 'ua' ? 'uk' : lang, [ruLocale, uaLocale]);
  }, [lang]);

  return (
    <LanguageSwitcher
      label={i18n('Language')}
      {...rest}
      value={lang}
      onChange={i18nStore.changeLang}
    />
  );
};
