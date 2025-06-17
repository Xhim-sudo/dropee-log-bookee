
import { DeliveryForm } from '../types/delivery';

// Pricing & Cost Configuration
export const RATE_PER_METER = 0.635;
export const BAD_WEATHER_SURCHARGE = 30;
export const OFF_HOUR_SURCHARGE = 50;
export const FAST_DELIVERY_BONUS = 20;
export const BASE_WEIGHT_KG = 6;
export const WEIGHT_SURCHARGE_PER_KG = 10;
export const FUEL_COST_PER_DELIVERY = 3;
export const STAFF_SALARY_PER_DELIVERY = 4;
export const MAINTENANCE_COST_PER_DELIVERY = 5;

// Automatic Discount Configuration
export const FIRST_3_ORDERS_DISCOUNT = 10; // Fixed 10₹ discount
export const AFTER_7_ORDERS_DISCOUNT_PERCENT = 5; // 5% discount

export interface FeeCalculation {
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
}

export const calculateDeliveryFee = (
  params: Partial<DeliveryForm>, 
  customerOrderCount: number = 0
): FeeCalculation => {
  const {
    distanceMeters = '0',
    weightKg = '0',
    isBadWeather = false,
    isOffHour = false,
    isFastDelivery = false,
    manualDiscountPercent = '0'
  } = params;

  // Validate and sanitize inputs
  const validDistance = Math.max(0, parseFloat(distanceMeters) || 0);
  const validWeight = Math.max(0, parseFloat(weightKg) || 0);
  const validDiscount = Math.min(100, Math.max(0, parseFloat(manualDiscountPercent) || 0));

  const distanceFee = validDistance * RATE_PER_METER;
  const weatherSurcharge = isBadWeather ? BAD_WEATHER_SURCHARGE : 0;
  const offHourSurcharge = isOffHour ? OFF_HOUR_SURCHARGE : 0;
  const expressBonus = isFastDelivery ? FAST_DELIVERY_BONUS : 0;
  
  let weightSurcharge = 0;
  if (validWeight > BASE_WEIGHT_KG) {
    weightSurcharge = (validWeight - BASE_WEIGHT_KG) * WEIGHT_SURCHARGE_PER_KG;
  }

  const totalSurcharges = weatherSurcharge + offHourSurcharge + weightSurcharge;
  const subtotal = distanceFee + totalSurcharges + expressBonus;
  
  // Calculate manual discount
  const manualDiscountAmount = subtotal * (validDiscount / 100);
  
  // Calculate automatic discount based on customer order count
  let autoDiscountAmount = 0;
  let autoDiscountType = '';
  
  if (customerOrderCount < 3) {
    // First 3 orders get 10₹ discount
    autoDiscountAmount = FIRST_3_ORDERS_DISCOUNT;
    autoDiscountType = `First 3 Orders (Order #${customerOrderCount + 1})`;
  } else if (customerOrderCount >= 7) {
    // After 7 orders, get 5% discount
    autoDiscountAmount = subtotal * (AFTER_7_ORDERS_DISCOUNT_PERCENT / 100);
    autoDiscountType = 'Loyalty Discount (7+ Orders)';
  }
  
  const totalDiscountAmount = manualDiscountAmount + autoDiscountAmount;
  const finalFee = Math.max(0, subtotal - totalDiscountAmount);
  const totalCosts = FUEL_COST_PER_DELIVERY + STAFF_SALARY_PER_DELIVERY + MAINTENANCE_COST_PER_DELIVERY;
  const profit = finalFee - totalCosts;

  return {
    distanceFee,
    weatherSurcharge,
    offHourSurcharge,
    expressBonus,
    weightSurcharge,
    totalSurcharges,
    subtotal,
    discountAmount: manualDiscountAmount,
    autoDiscountAmount,
    autoDiscountType,
    finalFee,
    totalCosts,
    profit,
    distanceKm: (validDistance / 1000).toFixed(2),
  };
};

export const validateDeliveryForm = (form: DeliveryForm): string | null => {
  if (!form.customerName.trim()) return 'Customer name is required';
  if (!form.customerPhone.trim()) return 'Customer phone is required';
  if (!form.customerAddress.trim()) return 'Customer address is required';
  if (!form.distanceMeters || parseFloat(form.distanceMeters) <= 0) return 'Valid distance is required';
  return null;
};
