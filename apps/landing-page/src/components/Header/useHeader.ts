const NAV_LINKS = [
  { href: '/products', label: 'Products', hasDropdown: true },
  { href: '/solutions', label: 'Solutions', hasDropdown: true },
  { href: '/resources', label: 'Resources', hasDropdown: true },
  { href: '/about', label: 'About', hasDropdown: true },
  { href: '/pricing', label: 'Pricing' },
];

export function useHeader() {
  const navLinks = NAV_LINKS;

  return {
    navLinks,
  };
}