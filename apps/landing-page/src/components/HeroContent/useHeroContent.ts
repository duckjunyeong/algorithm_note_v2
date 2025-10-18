// HeroContent/useHeroContent.ts
import { useNavigate } from "react-router-dom";
/**
 * HeroContent 컴포넌트의 데이터와 이벤트 핸들러를 제공하는 커스텀 훅입니다.
 */
export const useHeroContent = () => {
  const Navigate = useNavigate();

  const badgeText = '🎉 정식 출시!';
  const title = 'AI 학습 파트너 Synapse';
  const description =
    '아웃풋(Output) 훈련을 통해 당신의 지식을 잠시 머무는 정보가 아닌,\n 완전한 당신의 것으로 만들어 드립니다.';

  /** '무료로 시작하기' 버튼 클릭 시 실행될 핸들러입니다. */
  const handleStartClick = () => {
    Navigate('/sign-in');
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