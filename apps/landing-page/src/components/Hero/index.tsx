import { useHero } from './useHero';
import { HeroView } from './Hero.view';

export function Hero() {
  // 훅을 호출하여 필요한 상태와 로직을 가져옵니다.
  const { email, handleEmailChange, handleSubmit } = useHero();

  // View 컴포넌트에 props로 전달하여 최종 UI를 렌더링합니다.
  return (
    <HeroView
      email={email}
      onEmailChange={handleEmailChange}
      onSubmit={handleSubmit}
    />
  );
}