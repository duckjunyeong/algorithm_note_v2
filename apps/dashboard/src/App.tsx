import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./components/AuthProvider"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { useApiClient } from "./hooks/useApiClient"
import SignInPage from "./pages/SignIn"
import SignInWithEmailPage from "./pages/SignInWithEmail"
import SignUpPage from "./pages/SignUp"
import SignUpWithEmailPage from "./pages/SignUpWithEmail"
import SSOCallbackPage from "./pages/SSOCallback"
import SetupAccountPage from "./pages/SetupAccount"
import DashboardPage from "./pages/Dashboard"
import UnauthorizedPage from "./pages/Unauthorized"

function AppContent() {
  // Initialize API client with authentication
  useApiClient();

  return (
    <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-in/email" element={<SignInWithEmailPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-up/email" element={<SignUpWithEmailPage />} />
        <Route path="/sso-callback" element={<SSOCallbackPage />} />
        <Route path="/setup-account" element={<SetupAccountPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="member">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
  );
}

function App() {
  return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
  );
}

export default App
