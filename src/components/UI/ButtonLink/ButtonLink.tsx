import { useCallback } from 'react';
import cn from 'classnames';
import { Button, ButtonProps, RouterStore } from '@homecode/ui';

import S from './ButtonLink.styl';

type Props = typeof ButtonProps & {
  href: string;
  className?: string;
  isFloating?: boolean;
  isRound?: boolean;
};

export default function ButtonLink({
  className,
  href,
  onClick,
  isFloating,
  isRound,
  ...props
}: Props) {
  const onButtonClick = useCallback(
    e => {
      onClick?.(e);
      if (href) {
        if (/^http/.test(href)) window.open(href, '_blank');
        else RouterStore.go(href);
      }
    },
    [onClick, href]
  );

  return (
    <Button
      {...props}
      className={cn(
        S.root,
        isFloating && S.isFloating,
        isRound && S.isRound,
        className
      )}
      onClick={onButtonClick}
    />
  );
}
