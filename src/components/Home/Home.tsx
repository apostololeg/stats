import { withStore } from 'justorm/react';

import { Icon } from '@homecode/ui';

import { Container } from 'components/UI/Container/Container';
import ButtonLink from 'components/UI/ButtonLink/ButtonLink';
import ProjectsList from 'components/ProjectsList/ProjectsList';

// import { I18N as I18NG } from 'tools/i18n';

import S from './Home.styl';
import _i18n from './i18n';

const { I18N } = _i18n;

export default function Home() {
  return (
    <Container className={S.root}>
      <ProjectsList />
    </Container>
  );
}
