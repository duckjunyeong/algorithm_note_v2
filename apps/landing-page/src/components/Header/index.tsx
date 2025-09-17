import { HeaderView } from './Header.view';
import { useHeader } from './useHeader';

export function Header() {
  const { navLinks } = useHeader();

  return <HeaderView navLinks={navLinks} />;
}