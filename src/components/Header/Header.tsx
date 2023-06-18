import { ChangeEvent, useCallback, useState } from 'react';
import { withStore } from 'justorm/react';
import { Input, Link, debounce } from '@homecode/ui';

import S from './Header.styl';
import Logo from 'components/Logo/Logo';

type Props = {
  store?: any;
};

let acc = 0;

export default withStore({
  user: ['isLogged'],
  router: [],
})(function Header({ store: { header, user, router } }: Props) {
  const [showKeyInput, setShowKeyInput] = useState(false);

  const dropAcc = debounce(() => (acc = 0), 500);

  const onPointerUp = useCallback(() => {
    acc++;
    if (acc >= 10) setShowKeyInput(true);
    dropAcc();
  }, []);

  return (
    <div className={S.root} onPointerUp={onPointerUp}>
      {showKeyInput && !user.isLogged && (
        <Input
          onChange={((e, val) => user.login(val)) as any}
          value=""
          className={S.keyInput}
        />
      )}
      <Link href="/" isClear inline className={S.title}>
        <Logo />
        &nbsp; Stats
      </Link>
    </div>
  );
});
