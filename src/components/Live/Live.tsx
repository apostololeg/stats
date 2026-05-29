import { Redirect } from '@homecode/ui';

import LiveEvents from 'components/LiveEvents/LiveEvents';
import { Container } from 'components/UI/Container/Container';
import { useUser } from 'store/user';

import S from './Live.styl';

export default function Live() {
  const user = useUser(['isLogged']);

  if (!user.isLogged) return <Redirect to="/" />;

  return (
    <Container className={S.root}>
      <LiveEvents />
    </Container>
  );
}
