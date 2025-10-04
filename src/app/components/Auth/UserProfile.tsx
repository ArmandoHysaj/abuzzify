"use client";

import React, { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import './user-profile.scss';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout, verifyEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push('/');
      onClose();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      await verifyEmail();
      setMessage({ type: 'success', text: 'Verification email sent! Check your inbox.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send verification email.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !currentUser) return null;

  const isEmailVerified = currentUser.emailVerified;
  const providerData = currentUser.providerData;
  const isGoogleUser = providerData.some(provider => provider.providerId === 'google.com');

  return (
    <div className="user-profile-overlay" onClick={onClose}>
      <div className="user-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="user-profile-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="user-profile-header">
          <div className="user-avatar">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {currentUser.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="user-info">
            <h3>{currentUser.displayName || 'User'}</h3>
            <p className="user-email">{currentUser.email}</p>
            <div className="user-badges">
              {isGoogleUser && (
                <span className="badge google">
                  <svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </span>
              )}
              {isEmailVerified ? (
                <span className="badge verified">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Verified
                </span>
              ) : (
                <span className="badge unverified">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Unverified
                </span>
              )}
            </div>
          </div>
        </div>

        {message && (
          <div className={`user-profile-message ${message.type}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {message.type === 'success' ? (
                <>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </>
              ) : (
                <>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                </>
              )}
            </svg>
            {message.text}
          </div>
        )}

        <div className="user-profile-content">
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">
                {currentUser.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Sign In</span>
              <span className="stat-value">
                {currentUser.metadata.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          {!isEmailVerified && !isGoogleUser && (
            <div className="verification-section">
              <div className="verification-info">
                <h4>Verify Your Email</h4>
                <p>Please verify your email address to access all features and receive important updates.</p>
              </div>
              <button
                className="verify-button"
                onClick={handleVerifyEmail}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Verification Email'}
              </button>
            </div>
          )}

          <div className="user-actions">
            <button
              className="logout-button"
              onClick={handleLogout}
              disabled={isLoading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;