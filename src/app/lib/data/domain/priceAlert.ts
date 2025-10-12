import { PriceAlertRepository } from '../repositories/PriceAlert/priceAlertRepository';
import { PriceAlert } from '../repositories/Investment/model';
import { CreatePriceAlertInput, UpdatePriceAlertInput } from '../repositories/PriceAlert/model';

export interface PriceAlertCheckResult {
  shouldNotify: boolean;
  notificationType: 'buy-back' | 'avoid-buy' | 'price-drop' | 'price-increase';
  message: string;
  currentPrice: number;
  targetPrice: number;
  priceChange: number;
  priceChangePercent: number;
}

export class PriceAlertDomain {
  constructor(private priceAlertRepository: PriceAlertRepository) {}

  async createPriceAlert(userId: string, input: CreatePriceAlertInput): Promise<{ alertId: string }> {
    // Calculate buyBackPrice if not provided
    const buyBackPrice = input.buyBackPrice ?? this.calculateOptimalBuyBackPrice(
      input.currentPrice, 
      input.priceDropThreshold ?? 10
    );
    
    const alertData = {
      ...input,
      userId,
      alertType: 'sell-price' as const,
      alertStatus: 'active' as const,
      buyBackPrice, // Use provided or calculated buyBackPrice
    };

    const alertId = await this.priceAlertRepository.create(alertData);
    
    return { alertId };
  }

  async updatePriceAlert(alertId: string, updates: UpdatePriceAlertInput): Promise<void> {
    await this.priceAlertRepository.update(alertId, updates);
  }

  async deletePriceAlert(alertId: string): Promise<void> {
    await this.priceAlertRepository.delete(alertId);
  }

  async getUserPriceAlerts(userId: string): Promise<PriceAlert[]> {
    return await this.priceAlertRepository.getByUserId(userId);
  }

  async getPriceAlertById(alertId: string): Promise<PriceAlert | null> {
    return await this.priceAlertRepository.getById(alertId);
  }

  async checkPriceAlerts(currentPrices: Record<string, number>): Promise<PriceAlertCheckResult[]> {
    const activeAlerts = await this.priceAlertRepository.getActiveAlerts();
    const results: PriceAlertCheckResult[] = [];

    for (const alert of activeAlerts) {
      const currentPrice = currentPrices[alert.coinSymbol];
      if (!currentPrice) continue;

      // Check if we should send notification based on cooldown
      const lastNotified = alert.notifications.lastNotified;
      const cooldownMs = alert.alertRules.cooldownPeriod * 60 * 60 * 1000; // Convert hours to milliseconds
      const now = new Date();
      
      if (lastNotified) {
        const lastNotifiedDate = new Date(lastNotified);
        const timeSinceLastNotification = now.getTime() - lastNotifiedDate.getTime();
        if (timeSinceLastNotification < cooldownMs) {
          continue; // Still in cooldown period
        }
      }

      // Calculate price changes
      const priceChange = currentPrice - alert.sellPrice;
      const priceChangePercent = (priceChange / alert.sellPrice) * 100;

      // Check if price is below buy back threshold
      if (currentPrice <= alert.buyBackPrice) {
        results.push({
          shouldNotify: true,
          notificationType: 'buy-back',
          message: `🟢 SAFE TO BUY: ${alert.coinName} dropped ${Math.abs(priceChangePercent).toFixed(1)}% to $${currentPrice.toFixed(8)}. You can buy back at a lower price than you sold ($${alert.sellPrice.toFixed(8)})`,
          currentPrice,
          targetPrice: alert.buyBackPrice,
          priceChange,
          priceChangePercent,
        });

        // Mark alert as triggered and update notification count
        await this.priceAlertRepository.markAsTriggered(alert.id, currentPrice);
        await this.priceAlertRepository.updateNotificationCount(alert.id);
      }
      // Check if price increased significantly (warn against buying)
      else if (priceChangePercent >= alert.alertRules.priceIncreaseThreshold) {
        results.push({
          shouldNotify: true,
          notificationType: 'avoid-buy',
          message: `🔴 AVOID BUYING: ${alert.coinName} increased ${priceChangePercent.toFixed(1)}% to $${currentPrice.toFixed(8)}. Wait for a better entry price.`,
          currentPrice,
          targetPrice: alert.sellPrice,
          priceChange,
          priceChangePercent,
        });

        await this.priceAlertRepository.updateNotificationCount(alert.id);
      }
      // Check if price dropped significantly but not to buy back level
      else if (priceChangePercent <= -alert.alertRules.priceDropThreshold) {
        results.push({
          shouldNotify: true,
          notificationType: 'price-drop',
          message: `📉 PRICE DROP: ${alert.coinName} dropped ${Math.abs(priceChangePercent).toFixed(1)}% to $${currentPrice.toFixed(8)}. Watch for buy opportunity at $${alert.buyBackPrice.toFixed(8)}`,
          currentPrice,
          targetPrice: alert.buyBackPrice,
          priceChange,
          priceChangePercent,
        });

        await this.priceAlertRepository.updateNotificationCount(alert.id);
      }
      // Check if price increased but not significantly
      else if (priceChangePercent >= 2) { // Small increase threshold
        results.push({
          shouldNotify: true,
          notificationType: 'price-increase',
          message: `📈 PRICE UP: ${alert.coinName} increased ${priceChangePercent.toFixed(1)}% to $${currentPrice.toFixed(8)}. Monitor for potential sell opportunities.`,
          currentPrice,
          targetPrice: alert.sellPrice,
          priceChange,
          priceChangePercent,
        });

        await this.priceAlertRepository.updateNotificationCount(alert.id);
      }
    }

    return results;
  }

  calculateOptimalBuyBackPrice(sellPrice: number, dropThreshold: number = 10): number {
    return sellPrice * (1 - dropThreshold / 100);
  }

  calculateProfitFromReBuy(sellPrice: number, buyBackPrice: number, sellAmount: number): number {
    const coinsReceived = sellAmount / sellPrice;
    const newValue = coinsReceived * buyBackPrice;
    return newValue - sellAmount;
  }

  getNotificationMessage(alert: PriceAlert, currentPrice: number): string {
    const priceChange = currentPrice - alert.sellPrice;
    const priceChangePercent = (priceChange / alert.sellPrice) * 100;

    if (currentPrice <= alert.buyBackPrice) {
      return `🟢 BUY BACK OPPORTUNITY: ${alert.coinName} is now $${currentPrice.toFixed(8)} (${priceChangePercent.toFixed(1)}% change). You sold at $${alert.sellPrice.toFixed(8)}.`;
    } else if (priceChangePercent >= alert.alertRules.priceIncreaseThreshold) {
      return `🔴 AVOID BUYING: ${alert.coinName} increased ${priceChangePercent.toFixed(1)}% to $${currentPrice.toFixed(8)}.`;
    } else if (priceChangePercent <= -alert.alertRules.priceDropThreshold) {
      return `📉 PRICE DROP: ${alert.coinName} dropped ${Math.abs(priceChangePercent).toFixed(1)}% to $${currentPrice.toFixed(8)}.`;
    }

    return `📊 ${alert.coinName} is at $${currentPrice.toFixed(8)} (${priceChangePercent.toFixed(1)}% change from sell price).`;
  }
}
