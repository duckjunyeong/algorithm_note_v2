import { useNavigate } from 'react-router-dom';

export function useSignIn() {
  const navigate = useNavigate();

  const handleEmailSignInClick = () => {
    navigate('/sign-in/email');
  };

  return {
    handleEmailSignInClick
  };
}