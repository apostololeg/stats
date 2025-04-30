import { ChangeEvent, useCallback, useState } from 'react';
import { useStore } from 'justorm/react';
import { Input, Link, debounce } from '@homecode/ui';

import S from './Header.styl';
import Logo from 'components/Logo/Logo';

type Props = {
  store?: any;
};

let acc = 0;

export default function Header() {
  const { user } = useStore({
    user: ['isLogged'],
  });

  const [showKeyInput, setShowKeyInput] = useState(false);
  const [key, setKey] = useState('');

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
          className={S.keyInput}
          value={key}
          onChange={((e, val) => setKey(val)) as any}
          controlProps={{
            onKeyDown: e => {
              console.log('onKeyDown', e.key);
              if (e.key === 'Enter') {
                user.login(key);
                setShowKeyInput(false);
              }
            },
          }}
        />
      )}
      <Link href="/" isClear inline className={S.title}>
        <Logo />
        &nbsp; Stats
      </Link>
    </div>
  );
}
