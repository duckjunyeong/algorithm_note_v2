import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AlgorithmLogicFlowAnalysisPage from './pages/AlgorithmLogicFlowAnalysis';
import DashboardPage from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 루트 경로(/)로 접속 시 DashboardPage를 렌더링합니다. */}
        <Route path="/" element={<DashboardPage />} />
         <Route 
          path="/algorithm-logic-flow-analysis" 
          element={<AlgorithmLogicFlowAnalysisPage />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
