"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/app/contexts/AuthContext';
import './auth-modal.scss';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot-password';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    try {
      await login(data.email, data.password);
      setSuccess('Successfully logged in!');
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1000);
    } catch (error: any) {
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError('');
    try {
      await signup(data.email, data.password, data.displayName);
      setSuccess('Account created successfully! Please check your email to verify your account.');
    } catch (error: any) {
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      setSuccess('Successfully logged in with Google!');
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1000);
    } catch (error: any) {
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotPassword = async (email: string) => {
    setIsLoading(true);
    setError('');
    try {
      await resetPassword(email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password is too weak.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="auth-modal-header">
          <h2>
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot-password' && 'Reset Password'}
          </h2>
          <p>
            {mode === 'login' && 'Sign in to your Abuzzify account'}
            {mode === 'signup' && 'Join Abuzzify to track your crypto portfolio'}
            {mode === 'forgot-password' && 'Enter your email to reset your password'}
          </p>
        </div>

        {error && (
          <div className="auth-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {success}
          </div>
        )}

        <div className="auth-modal-content">
          {mode === 'login' && (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  {...loginForm.register('email')}
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className={loginForm.formState.errors.email ? 'error' : ''}
                />
                {loginForm.formState.errors.email && (
                  <span className="error-message">{loginForm.formState.errors.email.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  {...loginForm.register('password')}
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className={loginForm.formState.errors.password ? 'error' : ''}
                />
                {loginForm.formState.errors.password && (
                  <span className="error-message">{loginForm.formState.errors.password.message}</span>
                )}
              </div>

              <button
                type="button"
                className="forgot-password-link"
                onClick={() => setMode('forgot-password')}
              >
                Forgot your password?
              </button>

              <button type="submit" className="auth-button primary" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="auth-form">
              <div className="form-group">
                <label htmlFor="displayName">Full Name</label>
                <input
                  {...signupForm.register('displayName')}
                  type="text"
                  id="displayName"
                  placeholder="Enter your full name"
                  className={signupForm.formState.errors.displayName ? 'error' : ''}
                />
                {signupForm.formState.errors.displayName && (
                  <span className="error-message">{signupForm.formState.errors.displayName.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  {...signupForm.register('email')}
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className={signupForm.formState.errors.email ? 'error' : ''}
                />
                {signupForm.formState.errors.email && (
                  <span className="error-message">{signupForm.formState.errors.email.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  {...signupForm.register('password')}
                  type="password"
                  id="password"
                  placeholder="Create a password"
                  className={signupForm.formState.errors.password ? 'error' : ''}
                />
                {signupForm.formState.errors.password && (
                  <span className="error-message">{signupForm.formState.errors.password.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  {...signupForm.register('confirmPassword')}
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  className={signupForm.formState.errors.confirmPassword ? 'error' : ''}
                />
                {signupForm.formState.errors.confirmPassword && (
                  <span className="error-message">{signupForm.formState.errors.confirmPassword.message}</span>
                )}
              </div>

              <button type="submit" className="auth-button primary" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {mode === 'forgot-password' && (
            <div className="forgot-password-form">
              <form onSubmit={(e) => {
                e.preventDefault();
                const email = (e.target as any).email.value;
                onForgotPassword(email);
              }}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button type="submit" className="auth-button primary" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Email'}
                </button>
              </form>
            </div>
          )}

          {mode !== 'forgot-password' && (
            <>
              <div className="auth-divider">
                <span>or</span>
              </div>

              <button
                type="button"
                className="auth-button google"
                onClick={onGoogleLogin}
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}

          <div className="auth-modal-footer">
            {mode === 'login' && (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => setMode('signup')}
                >
                  Sign up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => setMode('login')}
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'forgot-password' && (
              <p>
                Remember your password?{' '}
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => setMode('login')}
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
