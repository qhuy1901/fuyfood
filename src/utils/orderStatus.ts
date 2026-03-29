export type OrderStatus = 'Order Placed' | 'Confirmed' | 'Delivering' | 'Delivered' | 'Cancelled' | 'Active';

export interface DynamicOrderInfo {
  created_at: string;
  delivered_at?: string;
  status: string;
}

/**
 * Calculates a dynamic status based on the time elapsed since creation
 * and the expected delivery time.
 */
export function calculateDynamicStatus(order: DynamicOrderInfo): OrderStatus {
  if (order.status === 'Cancelled') return 'Cancelled';
  
  const now = new Date().getTime();
  const createdAt = new Date(order.created_at).getTime();
  const elapsedMs = now - createdAt;
  const elapsedSec = elapsedMs / 1000;

  // 1. Order Placed: First 10 seconds
  if (elapsedSec < 10) {
    return 'Order Placed';
  }

  // 2. Confirmed: 10 seconds to 1 minute
  if (elapsedSec < 60) {
    return 'Confirmed';
  }

  // 3. Delivering/Delivered: Based on delivered_at
  if (order.delivered_at) {
    const deliveredAt = new Date(order.delivered_at).getTime();
    if (now >= deliveredAt) {
      return 'Delivered';
    }
    return 'Delivering';
  }

  // Fallback if delivered_at is missing but elapsed > 1m
  return 'Delivering';
}

/**
 * Returns a human-readable time string for a tracking step based on order timestamps.
 */
export function formatStepTime(stepLabel: string, createdAt: string, isReached: boolean, deliveredAt?: string): string {
  if (!isReached && stepLabel !== 'Order Placed') return 'Pending';

  const createdDate = new Date(createdAt);
  const deliveredDate = deliveredAt ? new Date(deliveredAt) : null;

  switch (stepLabel) {
    case 'Order Placed':
      return createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    case 'Preparing Your Food':
      return new Date(createdDate.getTime() + 10000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    case 'Driver Picking Up':
      return new Date(createdDate.getTime() + 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    case 'Delivering':
      return new Date(createdDate.getTime() + 75000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    case 'Delivered':
      if (deliveredDate) {
        return deliveredDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return 'Pending';

    default:
      return 'Pending';
  }
}

/**
 * Returns a percentage (0-100) for the order progress based on status.
 */
export function getStatusProgress(status: OrderStatus): number {
  switch (status) {
    case 'Order Placed': return 25;
    case 'Confirmed': return 50;
    case 'Delivering': return 75;
    case 'Delivered': return 100;
    default: return 0;
  }
}
