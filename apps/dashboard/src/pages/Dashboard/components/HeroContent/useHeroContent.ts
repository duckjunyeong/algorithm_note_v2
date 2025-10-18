export const useHeroContent = () => {
  const badgeText = '🎉 정식 출시!';
  const title = 'AI 학습 파트너 Synapse';
  const description =
    '바이브코딩을 시작하는 가장 체계적인 방법.\n코드베이스, 문서화, 구현계획 모두 Vooster가 해결할게요.';

  const handleStartClick = () => {
    console.log('Start for free button clicked');
  };

  const handleCommunityClick = () => {
    console.log('Community button clicked');
  };

  return {
    badgeText,
    title,
    description,
    handleStartClick,
    handleCommunityClick,
  };
};