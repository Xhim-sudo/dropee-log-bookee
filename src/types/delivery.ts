
export interface Customer {
  name: string;
  phone: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export type CustomerMap = { [key: string]: Customer };

export interface Delivery {
  id: number;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderDescription: string;
  distanceFee: number;
  weatherSurcharge: number;
  offHourSurcharge: number;
  expressBonus: number;
  weightSurcharge: number;
  totalSurcharges: number;
  subtotal: number;
  discountAmount: number;
  autoDiscountAmount: number;
  autoDiscountType: string;
  finalFee: number;
  totalCosts: number;
  profit: number;
  distanceKm: string;
  month: string;
  orderValue: number;
  weightKg: number;
  manualDiscountPercent: number;
  isBadWeather: boolean;
  isOffHour: boolean;
  isFastDelivery: boolean;
  distanceMeters: number;
  
  // Enhanced vendor and tracking fields
  vendorId?: string;
  vendorName?: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  isDefective?: boolean;
  autoDistanceMeters?: number;
  distanceSource?: string;
  performanceScore?: number;
}

export interface MonthlyData {
  deliveries: Delivery[];
  totalRevenue: number;
  totalProfit: number;
  totalDeliveries: number;
  totalDiscounts: number;
  totalSurcharges: number;
  expenses: number;
  netIncome: number;
  cashOnHandStart: number;
}

export interface DeliveryForm {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderDescription: string;
  distanceMeters: string;
  orderValue: string;
  weightKg: string;
  manualDiscountPercent: string;
  isBadWeather: boolean;
  isOffHour: boolean;
  isFastDelivery: boolean;
  
  // Enhanced vendor and tracking fields
  vendorId: string;
  
  // Enhanced tracking data (added during processing)
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  pickupLatitude?: number;
  pickupLongitude?: number;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  autoDistanceMeters?: number;
  distanceSource?: string;
}

export interface ExpenseForm {
  description: string;
  amount: string;
  category: string;
}
