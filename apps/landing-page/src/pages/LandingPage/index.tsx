// pages/landing/index.tsx
import { Header } from '../../components/Header';
import { HeroContent } from '../../components/HeroContent';
import { FeatureSection } from '../../components/FeatureSection'; // 새로 만든 FeatureSection import
import { useUser } from '@clerk/clerk-react';

const LandingPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  console.log("User loaded:", isLoaded, "Signed in:", isSignedIn, "User role:", user?.publicMetadata.role);



  return (
    <div className="flex min-h-screen flex-col bg-background-primary font-sans">
      <main className="flex-grow">
        <Header />
        <HeroContent />
        <FeatureSection />
      </main>
    </div>
  );
};

export default LandingPage;