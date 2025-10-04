import 'server-only';
import { cookies } from 'next/headers';
import { auth as adminAuth } from '../firestoreConnection';
import { logger } from '../utils/logger';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export async function createSessionCookie(idToken: string): Promise<string> {
  if (!adminAuth) {
    logger.error('❌ Firebase Admin Auth not initialized');
    throw new Error('Firebase Admin Auth not initialized');
  }

  try {
    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    logger.info('✅ Session cookie created successfully');
    return sessionCookie;
  } catch (error) {
    logger.error('❌ Failed to create session cookie:', { error: error instanceof Error ? error.message : String(error) });
    throw new Error('Failed to create session cookie');
  }
}

export async function verifySessionCookie(sessionCookie: string): Promise<AuthUser | null> {
  if (!adminAuth) {
    logger.error('❌ Firebase Admin Auth not initialized');
    return null;
  }
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    logger.info('✅ Session cookie verified successfully');
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email || null,
      displayName: decodedClaims.name || null,
      photoURL: decodedClaims.picture || null,
    };
  } catch (error) {
    logger.error('❌ Error verifying session cookie:', { error: error instanceof Error ? error.message : String(error) });
    return null;
  }
}

export async function getUserFromServer(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return null;
    }

    const user = await verifySessionCookie(sessionCookie);
    return user;
  } catch (error) {
    logger.error('Error getting user from server:', { error: error instanceof Error ? error.message : String(error) });
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getUserFromServer();
  if (!user) {
    throw new Error('Not authenticated');
  }
  return user;
}
