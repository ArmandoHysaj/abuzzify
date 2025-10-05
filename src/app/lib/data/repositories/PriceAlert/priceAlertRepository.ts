import { firestore } from '@/app/lib/firestoreConnection';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase-admin/firestore';
import { IPriceAlertRepository } from './interface';
import { PriceAlert, CreatePriceAlertInput, UpdatePriceAlertInput } from '../Investment/model';

export class PriceAlertRepository implements IPriceAlertRepository {
  private collectionName = 'priceAlerts';

  async create(priceAlertData: CreatePriceAlertInput): Promise<string> {
    if (!firestore) {
      throw new Error('Firestore not initialized');
    }
    
    const docRef = await firestore.collection(this.collectionName).add({
      ...priceAlertData,
      alertType: 'sell-price',
      alertStatus: 'active',
      notifications: {
        emailEnabled: priceAlertData.emailEnabled,
        browserEnabled: priceAlertData.browserEnabled,
        notificationCount: 0,
      },
      alertRules: {
        priceDropThreshold: priceAlertData.priceDropThreshold,
        priceIncreaseThreshold: priceAlertData.priceIncreaseThreshold,
        cooldownPeriod: priceAlertData.cooldownPeriod,
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  }

  async getById(id: string): Promise<PriceAlert | null> {
    if (!firestore) {
      throw new Error('Firestore not initialized');
    }
    
    const docSnap = await firestore.collection(this.collectionName).doc(id).get();

    if (!docSnap.exists) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      userId: data?.userId,
      investmentId: data?.investmentId,
      coinSymbol: data?.coinSymbol,
      coinName: data?.coinName,
      alertType: data?.alertType,
      sellPrice: data?.sellPrice,
      sellAmount: data?.sellAmount,
      sellDate: data?.sellDate,
      profitEarned: data?.profitEarned,
      buyBackPrice: data?.buyBackPrice,
      currentPrice: data?.currentPrice,
      alertStatus: data?.alertStatus,
      notifications: data?.notifications,
      alertRules: data?.alertRules,
      createdAt: data?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };
  }

  async getByUserId(userId: string): Promise<PriceAlert[]> {
    if (!firestore) {
      throw new Error('Firestore not initialized');
    }
    
    // Remove orderBy to avoid index requirement for now
    const querySnapshot = await firestore
      .collection(this.collectionName)
      .where('userId', '==', userId)
      .get();

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data?.userId,
        investmentId: data?.investmentId,
        coinSymbol: data?.coinSymbol,
        coinName: data?.coinName,
        alertType: data?.alertType,
        sellPrice: data?.sellPrice,
        sellAmount: data?.sellAmount,
        sellDate: data?.sellDate,
        profitEarned: data?.profitEarned,
        buyBackPrice: data?.buyBackPrice,
        currentPrice: data?.currentPrice,
        alertStatus: data?.alertStatus,
        notifications: data?.notifications,
        alertRules: data?.alertRules,
        createdAt: data?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
  }

  async getActiveAlerts(): Promise<PriceAlert[]> {
    if (!firestore) {
      throw new Error('Firestore not initialized');
    }
    
    const querySnapshot = await firestore
      .collection(this.collectionName)
      .where('alertStatus', '==', 'active')
      .get();

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data?.userId,
        investmentId: data?.investmentId,
        coinSymbol: data?.coinSymbol,
        coinName: data?.coinName,
        alertType: data?.alertType,
        sellPrice: data?.sellPrice,
        sellAmount: data?.sellAmount,
        sellDate: data?.sellDate,
        profitEarned: data?.profitEarned,
        buyBackPrice: data?.buyBackPrice,
        currentPrice: data?.currentPrice,
        alertStatus: data?.alertStatus,
        notifications: data?.notifications,
        alertRules: data?.alertRules,
        createdAt: data?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
  }

  async update(id: string, updates: UpdatePriceAlertInput): Promise<void> {
    if (!firestore) {
      throw new Error('Firestore not initialized');
    }
    
    await firestore.collection(this.collectionName).doc(id).update({
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async delete(id: string): Promise<void> {
    if (!firestore) {
      throw new Error('Firestore not initialized');
    }
    
    await firestore.collection(this.collectionName).doc(id).delete();
  }

  async markAsTriggered(id: string, currentPrice: number): Promise<void> {
    if (!firestore) {
      throw new Error('Firestore not initialized');
    }
    
    await firestore.collection(this.collectionName).doc(id).update({
      alertStatus: 'triggered',
      currentPrice,
      'notifications.lastNotified': Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }

  async updateNotificationCount(id: string): Promise<void> {
    if (!firestore) {
      throw new Error('Firestore not initialized');
    }
    
    const docSnap = await firestore.collection(this.collectionName).doc(id).get();
    
    if (docSnap.exists) {
      const currentCount = docSnap.data()?.notifications?.notificationCount || 0;
      await firestore.collection(this.collectionName).doc(id).update({
        'notifications.notificationCount': currentCount + 1,
        'notifications.lastNotified': Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
  }
}
