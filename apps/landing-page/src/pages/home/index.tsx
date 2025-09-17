import { HomeView } from './Home.view';
import { useHome } from './useHome';

export function Home() {
  const homeData = useHome();

  return <HomeView />;
}