import cn from 'classnames';
import { Button } from '@homecode/ui';

import S from './Base.styl';
import { useEffect, useState } from 'react';

export type Props = {
  className?: string;
  id: number;
  isSelected: boolean;
  type: 'objects' | 'users';
};

export default function MarkerBase({
  type,
  id,
  className,
  isSelected,
  ...props
}) {
  const classes = cn(S.root, isSelected && S.selected, className);
  const [ref, setRef] = useState<HTMLDivElement>();

  useEffect(() => {
    ref?.parentElement?.classList.toggle('selected', isSelected);
  }, [ref, isSelected]);

  return (
    <Button
      variant="clear"
      {...props}
      className={classes}
      square
      onRef={setRef}
    />
  );
}
