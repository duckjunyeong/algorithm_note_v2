// pages/landing/index.tsx
import { Header } from '../../components/Header';
import { HeroContent } from '../../components/HeroContent';
import { FeatureSection } from '../../components/FeatureSection'; // 새로 만든 FeatureSection import

/**
 * 서비스의 메인 랜딩 페이지입니다.
 */
const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background-primary font-sans">
      <main className="flex-grow">
        <Header />
        <HeroContent />
        <FeatureSection /> {/* HeroContent 아래에 FeatureSection 추가 */}
      </main>
    </div>
  );
};

export default LandingPage;