import { number } from '@homecode/ui';
import cn from 'classnames';

import S from './Ticker.styl';

export default function Ticker({
  value,
  theme = 'default',
  offsetX = 0,
  offsetY = 0,
}) {
  const style = {} as any;

  if (!value) return null;

  if (offsetX || offsetY)
    style.transform = `translate(${offsetX}px, ${offsetY}px)`;

  return (
    <div className={cn(S.root, S[`theme-${theme}`])} style={style}>
      {number.format.short(value)}
    </div>
  );
}
