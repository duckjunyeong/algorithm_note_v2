import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./components/AuthProvider"
import { useApiClient } from "./hooks/useApiClient"
import LandingPage from "./pages/LandingPage"
import SignInPage from "./pages/SignIn"
import SignInWithEmailPage from "./pages/SignInWithEmail"
import SignUpPage from "./pages/SignUp"
import SignUpWithEmailPage from "./pages/SignUpWithEmail"
import SSOCallbackPage from "./pages/SSOCallback"
import SetupAccountPage from "./pages/SetupAccount"
import UnauthorizedPage from "./pages/Unauthorized"
import { Components } from "./pages/Components"

function AppContent() {
  // Initialize API client with authentication
  useApiClient();


  return (
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-in/email" element={<SignInWithEmailPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-up/email" element={<SignUpWithEmailPage />} />
        <Route path="/sso-callback" element={<SSOCallbackPage />} />
        <Route path="/setup-account" element={<SetupAccountPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/components" element={<Components />} />
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
