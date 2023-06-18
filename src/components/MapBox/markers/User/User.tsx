import { Avatar } from 'components/UI/Avatar/Avatar';
import { withStore } from 'justorm/react';
import { useEffect } from 'react';

import MarkerBase from '../Base/Base';

import S from './User.styl';

export default withStore({ users: 'byId' })(function MarkerUser({
  store: { users },
  ...props
}) {
  const { id } = props;

  useEffect(() => {
    users.loadById(id);
  }, [id]);

  const src = users.byId[id]?.avatar;

  return (
    <MarkerBase {...props} className={S.root}>
      <Avatar url={src} className={S.avatar} />
    </MarkerBase>
  );
});
