import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // For development, you can use Application Default Credentials
  // or service account key file
};

let firebaseAdminApp;

// Check if Firebase Admin is already initialized
if (getApps().length === 0) {
  try {
    // Try to initialize with service account if available
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      firebaseAdminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
      console.log('✅ Firebase Admin SDK initialized with service account');
    } else {
      console.log('⚠️ No service account key found, trying without credentials');
      // Use Application Default Credentials (for production)
      firebaseAdminApp = initializeApp(firebaseAdminConfig);
      console.log('✅ Firebase Admin SDK initialized without credentials');
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    firebaseAdminApp = null;
  }
} else {
  firebaseAdminApp = getApps()[0];
  console.log('✅ Firebase Admin SDK already initialized');
}

// Export Firestore and Auth instances
export const firestore = firebaseAdminApp ? getFirestore(firebaseAdminApp) : null;
export const auth = firebaseAdminApp ? getAuth(firebaseAdminApp) : null;

export default firebaseAdminApp;
