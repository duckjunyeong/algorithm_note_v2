import React from "react"
import { Routes, Route } from "react-router-dom"
import SignInPage from "./pages/SignIn"
import SignInWithEmailPage from "./pages/SignInWithEmail"

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-in/email" element={<SignInWithEmailPage />} />
    </Routes>
  )
}

export default App
