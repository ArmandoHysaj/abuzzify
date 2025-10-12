import {
  CollectionReference,
  Timestamp
} from 'firebase-admin/firestore';
import { UserRepository } from './interface';
import {
  UserDataType,
  userDomainResponse,
  UserFormDataType,
  UserModelResponse
} from './model';
import { firestore } from '../../../firestoreConnection';
import { serializeFirestoreData } from '../../../data/helpers';
import { logger } from '../../../utils/logger';
import { getAuth } from 'firebase-admin/auth';

export class UserRepo implements UserRepository {
  private get collection(): CollectionReference<UserDataType> {
    if (!firestore) {
      throw new Error('Firestore not initialized');
    }
    return firestore.collection('users') as CollectionReference<UserDataType>;
  }

  async createUser(
    userData: Omit<UserFormDataType, 'createdAt'>
  ): Promise<string> {
    if (!this.collection) throw new Error('Firestore collection not available');
    const { password, ...restUserData } = userData;
    
    // Check if this is a special case (Google OAuth or existing user login)
    const isDummyPassword = password === 'google-oauth-user' || password === 'existing-user';
    
    // Get Firebase Auth instance
    const auth = getAuth();
    try {
      // Find the existing Firebase Auth user by email
      const userRecord = await auth.getUserByEmail(userData.email);
      
      const docRef = this.collection.doc(userRecord.uid);
      
      // Check if document already exists
      const existingDoc = await docRef.get();
      if (existingDoc.exists) {
        logger.info('User document already exists, updating lastLogin', {
          uid: userRecord.uid,
          email: userData.email
        });
        // Update lastLogin timestamp
        await docRef.update({
          lastLogin: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        return docRef.id;
      }
      
      // Create new document
      await docRef.set({
        ...restUserData,
        email: userData.email.toLowerCase(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastLogin: Timestamp.now()
      });

      logger.info('User document created successfully', {
        uid: docRef.id,
        email: userData.email
      });

      return docRef.id;
    } catch (error) {
      logger.error(
        'Failed to create Firestore document for user',
        { 
          email: userData.email, 
          name: userData.name,
          error: error instanceof Error ? error.message : String(error)
        }
      );
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<string | null> {
    const collection = this.collection;
    if (!collection) return null;
    try {
      const query = await collection.where('email', '==', email).limit(1).get();

      if (!query.empty) {
        return query.docs[0].id;
      }
      return null;
    } catch (error) {
      logger.error(
        'Failed to find user by email',
        { 
          email,
          error: error instanceof Error ? error.message : String(error)
        }
      );
      throw error;
    }
  }

  async getUserById(userId: string): Promise<UserModelResponse | null> {
    if (!this.collection) return null;
    try {
      const doc = await this.collection.doc(userId).get();

      if (!doc.exists) {
        return null;
      }

      const rawData = doc.data();
      if (!rawData) return null;

      const serializedData = serializeFirestoreData(rawData) as Record<
        string,
        unknown
      >;

      if (!serializedData.id) {
        serializedData.id = doc.id;
      }

      const parseResult = userDomainResponse.safeParse(serializedData);
      if (parseResult.success) {
        return parseResult.data;
      } else {
        logger.warn('Invalid user data', {
          userId,
          error: parseResult.error
        });
        return null;
      }
    } catch (error) {
      logger.error(
        'Failed to get user by ID',
        { 
          userId,
          error: error instanceof Error ? error.message : String(error)
        }
      );
      throw error;
    }
  }
}

export const userRepository = new UserRepo();
