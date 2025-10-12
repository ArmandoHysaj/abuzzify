"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  UserCredential,
} from 'firebase/auth';
import { auth } from '@/app/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, displayName: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    await sendEmailVerification(result.user);
    
    // Auto-create user document in Firestore using server action
    const { createUserAction } = await import('@/app/lib/data/user-actions');
    await createUserAction({
      name: displayName,
      email: email,
      password: password,
      role: 'user' // Default role
    });
    
    // Create session cookie after successful signup
    const idToken = await result.user.getIdToken();
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    
    return result;
  };

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Ensure user document exists in Firestore (if it doesn't exist, create it)
    const { createUserAction } = await import('@/app/lib/data/user-actions');
    try {
      await createUserAction({
        name: result.user.displayName || 'User',
        email: result.user.email || '',
        password: 'existing-user', // Dummy password for existing email users
        role: 'user'
      });
    } catch (error) {
      // User document might already exist, that's okay
      console.log('User document creation skipped (likely already exists):', error);
    }
    
    // Create session cookie after successful login
    const idToken = await result.user.getIdToken();
    try {
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      
      if (!sessionResponse.ok) {
        console.error('Failed to create session cookie:', await sessionResponse.text());
      } else {
        console.log('Session cookie created successfully');
      }
    } catch (sessionError) {
      console.error('Error creating session cookie:', sessionError);
    }
    
    return result;
  };

  const logout = async () => {
    if (!auth) throw new Error('Firebase not initialized');
    
    // Delete session cookie
    await fetch('/api/auth/session', {
      method: 'DELETE',
    });
    
    return signOut(auth);
  };

  const loginWithGoogle = async () => {
    if (!auth) throw new Error('Firebase not initialized');
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    const result = await signInWithPopup(auth, provider);
    
    // Auto-create user document in Firestore using server action (if doesn't exist)
    const { createUserAction } = await import('@/app/lib/data/user-actions');
    try {
      await createUserAction({
        name: result.user.displayName || 'User',
        email: result.user.email || '',
        password: 'google-oauth-user', // Dummy password for Google users
        role: 'user'
      });
    } catch (error) {
      // User might already exist, that's okay
      console.log('User creation skipped (likely already exists):', error);
    }
    
    // Create session cookie after successful Google login
    const idToken = await result.user.getIdToken();
    try {
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      
      if (!sessionResponse.ok) {
        console.error('Failed to create session cookie:', await sessionResponse.text());
      } else {
        console.log('Session cookie created successfully');
      }
    } catch (sessionError) {
      console.error('Error creating session cookie:', sessionError);
    }
    
    return result;
  };

  const resetPassword = (email: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    return sendPasswordResetEmail(auth, email);
  };

  const verifyEmail = async () => {
    if (currentUser) {
      return sendEmailVerification(currentUser);
    }
    throw new Error('No user logged in');
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // If user is authenticated but we don't have a session cookie, create one
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          });
          
          if (response.ok) {
            console.log('Session cookie recreated successfully');
          } else {
            console.error('Failed to recreate session cookie:', await response.text());
          }
        } catch (error) {
          console.error('Error recreating session cookie:', error);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    loginWithGoogle,
    resetPassword,
    verifyEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
