import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';
import { z } from 'zod';

// Zod schemas for validation
const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
});

const verificationCodeSchema = z.object({
  code: z
    .string()
    .min(6, 'Verification code must be 6 digits')
    .max(6, 'Verification code must be 6 digits')
});

type SignUpStep = 'email' | 'password' | 'verification';

export function useSignUpWithEmail() {
  const [step, setStep] = useState<SignUpStep>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { signUp, setActive } = useSignUp();

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) {
      setError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (error) {
      setError('');
    }
  };

  const handleVerificationCodeChange = (value: string) => {
    setVerificationCode(value);
    if (error) {
      setError('');
    }
  };

  const handleBackToLogin = () => {
    navigate('/sign-in');
  };

  const handleBackToEmail = () => {
    setStep('email');
    setPassword('');
    setError('');
  };

  const handleBackToPassword = () => {
    setStep('password');
    setVerificationCode('');
    setError('');
  };

  const checkEmailAndProceed = async () => {
    const validation = emailSchema.safeParse({ email });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await signUp?.create({
        emailAddress: email,
      });

      setStep('password');
    } catch (err: any) {
      console.error('Email check error:', err);

      // Check if it's an existing user error
      if (err.errors?.some((error: any) =>
        error.code === 'form_identifier_exists' ||
        error.code === 'form_identifier_not_found'
      )) {
        setError('This email is already registered. Please sign in instead.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async () => {
    const validation = passwordSchema.safeParse({ password });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Create account with email and password
      await signUp?.update({
        password: password,
      });

      // Send verification email
      await signUp?.prepareEmailAddressVerification({ strategy: 'email_code' });

      setStep('verification');
    } catch (err: any) {
      console.error('Account creation error:', err);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmailAndComplete = async () => {
    const validation = verificationCodeSchema.safeParse({ code: verificationCode });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await signUp?.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result?.status === 'complete') {
        console.log('reuslt', result);
        await setActive({ session: result.createdSessionId });

        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    switch (step) {
      case 'email':
        await checkEmailAndProceed();
        break;
      case 'password':
        await createAccount();
        break;
      case 'verification':
        await verifyEmailAndComplete();
        break;
    }
  };

  const handleContinueClick = async () => {
    switch (step) {
      case 'email':
        await checkEmailAndProceed();
        break;
      case 'password':
        await createAccount();
        break;
      case 'verification':
        await verifyEmailAndComplete();
        break;
    }
  };

  return {
    step,
    email,
    password,
    verificationCode,
    error,
    isLoading,
    handleEmailChange,
    handlePasswordChange,
    handleVerificationCodeChange,
    handleBackToLogin,
    handleBackToEmail,
    handleBackToPassword,
    handleSubmit,
    handleContinueClick
  };
}