import { useHeader } from './useHeader'
import { HeaderView } from './Header.view';

/**
 * 웹사이트의 메인 헤더 컴포넌트입니다.
 * 로고, 네비게이션 링크, 사용자 액션 버튼을 포함합니다.
 */
export const Header = () => {
  const { navLinks, authButtonText, handleAuthClick, handleRequestDemo, handleTryForFree } =
    useHeader();

  return (
    <HeaderView
      navLinks={navLinks}
      authButtonText={authButtonText}
      onAuthClick={handleAuthClick}
      onRequestDemoClick={handleRequestDemo}
      onTryForFreeClick={handleTryForFree}
    />
  );
};