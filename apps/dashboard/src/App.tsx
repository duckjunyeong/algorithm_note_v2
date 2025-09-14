import React from "react"
import { SignInWithEmailButton }from "../../../libs/ui-components/src/components/sign-in-with-email-button"

function App() {
  return (
    <SignInWithEmailButton onClick={() => alert("Clicked!")} />
  )
}

export default App
