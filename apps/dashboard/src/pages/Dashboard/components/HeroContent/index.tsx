import { HeroContentView } from './HeroContent.view';
import { useHeroContent } from './useHeroContent';

export const HeroContent = () => {
  const {
    title,
    description,
    handleStartClick,
    handleCommunityClick,
  } = useHeroContent();

  return (
    <HeroContentView
      title={title}
      description={description}
      onStartClick={handleStartClick}
      onCommunityClick={handleCommunityClick}
    />
  );
};