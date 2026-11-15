import cn from 'classnames';
import type { ReactNode } from 'react';

import S from './ChartTooltip.styl';

type Props = {
  className?: string;
  children: ReactNode;
};

// Shared look for every recharts tooltip in the app.
export function ChartTooltip({ className, children }: Props) {
  return <div className={cn(S.root, className)}>{children}</div>;
}

export function ChartTooltipLabel({ className, children }: Props) {
  return <span className={cn(S.label, className)}>{children}</span>;
}
