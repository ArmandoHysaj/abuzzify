import { PriceAlert } from '../Investment/model';
import { CreatePriceAlertInput, UpdatePriceAlertInput } from './model';

export interface IPriceAlertRepository {
  create(priceAlert: CreatePriceAlertInput): Promise<string>;
  getById(id: string): Promise<PriceAlert | null>;
  getByUserId(userId: string): Promise<PriceAlert[]>;
  getActiveAlerts(): Promise<PriceAlert[]>;
  update(id: string, updates: UpdatePriceAlertInput): Promise<void>;
  delete(id: string): Promise<void>;
  markAsTriggered(id: string, currentPrice: number): Promise<void>;
  updateNotificationCount(id: string): Promise<void>;
}
