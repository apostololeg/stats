import { Container as UIContainer, Scroll } from '@homecode/ui';
import cn from 'classnames';

import S from './Container.styl';

export const Container = ({ children, className, ...props }) => (
  <Scroll
    y
    size="m"
    offset={{ y: { before: 100 + 20, after: 20 } }}
    className={cn(S.scrolledView, className)}
    innerClassName={S.scrolledViewInner}
    autoHide
  >
    <UIContainer vertical size="m" {...props}>
      {/* <HeaderGap /> */}
      {children}
      {/* <HeaderGap /> */}
    </UIContainer>
  </Scroll>
);
