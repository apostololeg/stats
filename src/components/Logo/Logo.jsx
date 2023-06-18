import cn from 'classnames';

import { Link } from '@homecode/ui';

import s from './Logo.styl';

import LogoSVG from '../../../assets/icon.svg';

const Logo = ({ className = '' }) => (
  <Link href="/" className={cn(s.root, className)} isClear inline>
    <LogoSVG />
  </Link>
);

export default Logo;
