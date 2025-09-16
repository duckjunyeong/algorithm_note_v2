export interface FooterProps {
  className?: string;
  companyName?: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
  socialLinks?: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
  }>;
  showCopyright?: boolean;
  copyrightYear?: number;
}

export const useFooter = (props: FooterProps) => {
  const {
    className = '',
    companyName = 'AlgoRevise',
    links = [],
    socialLinks = [],
    showCopyright = true,
    copyrightYear = new Date().getFullYear(),
  } = props;

  const footerClasses = `bg-neutral-900 text-neutral-100 py-12 ${className}`;

  return {
    footerClasses,
    companyName,
    links,
    socialLinks,
    showCopyright,
    copyrightYear,
  };
};