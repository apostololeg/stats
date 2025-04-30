import { useCallback, useState } from 'react';
import { useStore } from 'justorm/react';
import { Button, Input, debounce } from '@homecode/ui';
import cn from 'classnames';

import S from './Header.styl';
import Logo from 'components/Logo/Logo';
import BREAKPOINTS from 'constants/layoutBreakpoints.json';

type Props = {
  store?: any;
};

let acc = 0;

export default function Header() {
  const { user, router, app } = useStore({
    user: ['isLogged'],
    router: [],
    app: ['isSidebarOpen'],
  });

  const [showKeyInput, setShowKeyInput] = useState(false);
  const [key, setKey] = useState('');

  const dropAcc = debounce(() => (acc = 0), 500);

  const onPointerUp = useCallback(() => {
    acc++;
    if (acc >= 10) setShowKeyInput(true);
    dropAcc();
  }, []);

  const handleClick = useCallback(() => {
    if (window.innerWidth < BREAKPOINTS.MOBILE) {
      app.toggleSidebar();
    } else {
      router.go('/');
    }
  }, [user.isLogged]);

  return (
    <div
      className={cn(S.root, app.isSidebarOpen && S.isSidebarOpen)}
      onPointerUp={onPointerUp}
    >
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
      <Button variant="clear" className={S.title} onClick={handleClick}>
        <Logo />
        &nbsp; Stats
      </Button>
    </div>
  );
}
