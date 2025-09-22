import { HeroContentView } from './HeroContent.view';
import { useHeroContent } from './useHeroContent';

/**
 * 랜딩 페이지의 최상단에 위치하는 히어로 섹션 컴포넌트입니다.
 * 사용자에게 서비스의 핵심 가치를 전달하고 주요 행동을 유도합니다.
 */
export const HeroContent = () => {
  const {
    badgeText,
    title,
    description,
    handleStartClick,
    handleCommunityClick,
  } = useHeroContent();

  return (
    <HeroContentView
      badgeText={badgeText}
      title={title}
      description={description}
      onStartClick={handleStartClick}
      onCommunityClick={handleCommunityClick}
    />
  );
};