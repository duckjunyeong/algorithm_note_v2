import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AlgorithmLogicFlowAnalysisPage from './pages/AlgorithmLogicFlowAnalysis';
import DashboardPage from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthProvider';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={ <ProtectedRoute> <DashboardPage /></ProtectedRoute>} />
          <Route 
            path="/algorithm-logic-flow-analysis" 
            element={<AlgorithmLogicFlowAnalysisPage />} 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
