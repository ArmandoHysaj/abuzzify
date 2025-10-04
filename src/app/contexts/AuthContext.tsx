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
    return result;
  };

  const login = (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (!auth) throw new Error('Firebase not initialized');
    return signOut(auth);
  };

  const loginWithGoogle = async () => {
    if (!auth) throw new Error('Firebase not initialized');
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    return signInWithPopup(auth, provider);
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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
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
