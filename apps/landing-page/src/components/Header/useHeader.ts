/** 네비게이션 링크의 구조를 정의하는 타입입니다. */
export type NavLink = {
  label: string;
  href: string;
};

export const useHeader = () => {
  const navLinks: NavLink[] = [
    { label: 'Product', href: '#' },
    { label: 'Solutions', href: '#' },
    { label: 'Resources', href: '#' },
    { label: 'Pricing', href: '#' },
  ];

  const handleSignIn = () => {
    // TODO: 실제 로그인 로직 구현
    console.log('Sign In clicked');
    alert('Sign In clicked!');
  };

  const handleRequestDemo = () => {
    // TODO: 실제 데모 요청 로직 구현
    console.log('Request a Demo clicked');
    alert('Request a Demo clicked!');
  };

  const handleTryForFree = () => {
    // TODO: 실제 무료 체험 로직 구현
    console.log('Try for Free clicked');
    alert('Try for Free clicked!');
  };

  return {
    navLinks,
    handleSignIn,
    handleRequestDemo,
    handleTryForFree,
  };
};