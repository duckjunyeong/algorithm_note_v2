import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import DashboardPage from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthProvider';
import { useApiClient } from './hooks/useApiClient';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  useApiClient();

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={ <ProtectedRoute> <DashboardPage /></ProtectedRoute>} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
