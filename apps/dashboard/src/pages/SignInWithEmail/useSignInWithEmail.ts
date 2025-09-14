import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';
import { z } from 'zod';

// Zod schema for email validation
const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
});

export function useSignInWithEmail() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { signIn } = useSignIn();

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) {
      setError('');
    }
  };

  const handleBackToLogin = () => {
    navigate('/sign-in');
  };

  const handleEmailLogin = async () => {
    // Validate email with Zod
    const validation = emailSchema.safeParse({ email });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await signIn?.create({
        identifier: email,
      });
      console.log('Email sign-in initiated for:', email);

    } catch (err) {
      console.error('Sign-in error:', err);
      setError('An error occurred during sign-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleEmailLogin();
  };

  return {
    email,
    error,
    isLoading,
    handleEmailChange,
    handleBackToLogin,
    handleSubmit,
    handleContinueClick: handleEmailLogin
  };
}