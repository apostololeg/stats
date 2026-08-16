import ButtonLink from 'components/UI/ButtonLink/ButtonLink';
import { Container } from 'components/UI/Container/Container';
import { Icon } from '@homecode/ui';
import ProjectsList from 'components/ProjectsList/ProjectsList';
import S from './Home.styl';
import _i18n from './i18n';

// import { I18N as I18NG } from 'tools/i18n';


const { I18N } = _i18n;

export default function Home() {
  return (
    <Container className={S.root}>
      <ProjectsList inline />
    </Container>
  );
}
