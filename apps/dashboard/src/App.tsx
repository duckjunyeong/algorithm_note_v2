import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./components/AuthProvider"
import { ProtectedRoute } from "./components/ProtectedRoute"
import SignInPage from "./pages/SignIn"
import SignInWithEmailPage from "./pages/SignInWithEmail"
import SignUpPage from "./pages/SignUp"
import SignUpWithEmailPage from "./pages/SignUpWithEmail"
import SSOCallbackPage from "./pages/SSOCallback"
import DashboardPage from "./pages/Dashboard"
import UnauthorizedPage from "./pages/Unauthorized"

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<SignInPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-in/email" element={<SignInWithEmailPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-up/email" element={<SignUpWithEmailPage />} />
        <Route path="/sso-callback" element={<SSOCallbackPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected routes - require authentication and 'member' role */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="member">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
