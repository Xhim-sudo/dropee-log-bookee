
import { DeliveryForm } from '../types/delivery';

// Pricing & Cost Configuration
export const RATE_PER_METER = 0.05;
export const BAD_WEATHER_SURCHARGE = 30;
export const OFF_HOUR_SURCHARGE = 50;
export const FAST_DELIVERY_BONUS = 20;
export const BASE_WEIGHT_KG = 6;
export const WEIGHT_SURCHARGE_PER_KG = 10;
export const FUEL_COST_PER_DELIVERY = 3;
export const STAFF_SALARY_PER_DELIVERY = 4;
export const MAINTENANCE_COST_PER_DELIVERY = 5;

export interface FeeCalculation {
  distanceFee: number;
  weatherSurcharge: number;
  offHourSurcharge: number;
  expressBonus: number;
  weightSurcharge: number;
  totalSurcharges: number;
  subtotal: number;
  discountAmount: number;
  finalFee: number;
  totalCosts: number;
  profit: number;
  distanceKm: string;
}

export const calculateDeliveryFee = (params: Partial<DeliveryForm>): FeeCalculation => {
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
  const discountAmount = subtotal * (validDiscount / 100);
  const finalFee = Math.max(0, subtotal - discountAmount);
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
    discountAmount,
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
