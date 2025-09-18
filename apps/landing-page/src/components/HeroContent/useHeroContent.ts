// HeroContent/useHeroContent.ts

/**
 * HeroContent 컴포넌트의 데이터와 이벤트 핸들러를 제공하는 커스텀 훅입니다.
 */
export const useHeroContent = () => {
  const badgeText = '🎉 정식 출시!';
  const title = '알고리즘 오답 관리 AlgorNote';
  const description =
    '바이브코딩을 시작하는 가장 체계적인 방법.\n코드베이스, 문서화, 구현계획 모두 Vooster가 해결할게요.';

  /** '무료로 시작하기' 버튼 클릭 시 실행될 핸들러입니다. */
  const handleStartClick = () => {
    console.log('Start for free button clicked');
    // 실제 서비스에서는 회원가입 페이지 이동 등의 로직이 필요합니다.
  };

  /** '커뮤니티' 버튼 클릭 시 실행될 핸들러입니다. */
  const handleCommunityClick = () => {
    console.log('Community button clicked');
    // 실제 서비스에서는 커뮤니티 링크로 이동하는 로직이 필요합니다.
  };

  return {
    badgeText,
    title,
    description,
    handleStartClick,
    handleCommunityClick,
  };
};