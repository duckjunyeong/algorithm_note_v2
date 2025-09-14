import { Routes, Route } from "react-router-dom"
import SignInPage from "./pages/SignIn"
import SignInWithEmailPage from "./pages/SignInWithEmail"
import SignUpPage from "./pages/SignUp"
import SignUpWithEmailPage from "./pages/SignUpWithEmail"

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-in/email" element={<SignInWithEmailPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/sign-up/email" element={<SignUpWithEmailPage />} />
    </Routes>
  )
}

export default App
