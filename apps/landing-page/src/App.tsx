import { BrowserRouter, Routes, Route } from 'react-router-dom';
import  LandingPage  from './pages/LandingPage';
// import { PricingPage } from './pages/Pricing'; // 예시: 추후 다른 페이지 추가

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 루트 경로(/)로 접속 시 LandingPage를 렌더링합니다. */}
        <Route path="/" element={<LandingPage />} />

        {/* 다른 페이지가 추가될 경우, 여기에 Route를 추가하면 됩니다.
          예: <Route path="/pricing" element={<PricingPage />} /> 
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
