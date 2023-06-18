import { CSSProperties } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';

import fileURL from 'tools/fileURL';

import MarkerBase from '../Base/Base';

import S from './Object.styl';

export default withStore({ reports: '' })(function MarkerObject({
  store: { reports },
  className,
  ...props
}) {
  const { id } = props;
  const style = {} as CSSProperties;

  return (
    <MarkerBase {...props} className={cn(S.root, className)}>
      <div className={S.inner} style={style} />
    </MarkerBase>
  );
});
