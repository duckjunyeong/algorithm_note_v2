import { useAuthTest } from './useAuthTest'
import { AuthTestView } from './AuthTest.view'

export function AuthTest() {
  const authData = useAuthTest()

  return <AuthTestView {...authData} />
}

export { useAuthTest } from './useAuthTest'
export type { AuthTestData } from './useAuthTest'