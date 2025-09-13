import { useState } from 'react'
import { SignIn, SignOutButton, SignedIn, SignedOut } from '@clerk/clerk-react'
import { AuthTest } from '../../../libs/ui-components/src/components/auth-test'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div style={{ margin: '2rem 0' }}>
        <AuthTest />
      </div>

      <SignedOut>
        <div style={{ margin: '2rem 0' }}>
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
          <div style={{ marginTop: '1rem' }}>
            <SignOutButton />
          </div>
        </div>
      </SignedIn>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
