
import { DeliveryForm } from '../types/delivery';
import { supabase } from '../integrations/supabase/client';

// Pricing & Cost Configuration (Legacy - kept for fallback)
export const RATE_PER_METER = 0.0635;
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
  
  // New tiered pricing fields
  distanceTier?: string;
  baseTierFee?: number;
  excessDistanceMeters?: number;
  excessDistanceFee?: number;
  isEssentialMode?: boolean;
  essentialModeDiscount?: number;
}

// Fetch pricing configuration from database
export const getPricingConfig = async () => {
  const { data, error } = await supabase
    .from('pricing_config')
    .select('*')
    .eq('is_active', true)
    .eq('config_name', 'default')
    .single();

  if (error) {
    console.warn('Failed to fetch pricing config, using defaults:', error);
    return {
      tier_1_max_meters: 3000,
      tier_1_rate: 0.0400,
      tier_2_max_meters: 7000,
      tier_2_rate: 0.0500,
      tier_3_rate: 0.0635,
      essential_discount_percent: 20.0
    };
  }

  return data;
};

// Calculate tiered distance fee
export const calculateTieredDistanceFee = (
  distanceMeters: number,
  pricingConfig: any,
  isEssentialMode: boolean = false
) => {
  let baseTierFee = 0;
  let excessDistanceMeters = 0;
  let excessDistanceFee = 0;
  let distanceTier = '';

  if (distanceMeters <= pricingConfig.tier_1_max_meters) {
    // Tier 1: 0-3km
    baseTierFee = distanceMeters * pricingConfig.tier_1_rate;
    distanceTier = 'tier_1';
  } else if (distanceMeters <= pricingConfig.tier_2_max_meters) {
    // Tier 2: 3-7km
    baseTierFee = pricingConfig.tier_1_max_meters * pricingConfig.tier_1_rate;
    excessDistanceMeters = distanceMeters - pricingConfig.tier_1_max_meters;
    excessDistanceFee = excessDistanceMeters * pricingConfig.tier_2_rate;
    distanceTier = 'tier_2';
  } else {
    // Tier 3: 7km+
    baseTierFee = pricingConfig.tier_1_max_meters * pricingConfig.tier_1_rate;
    const tier2Distance = pricingConfig.tier_2_max_meters - pricingConfig.tier_1_max_meters;
    baseTierFee += tier2Distance * pricingConfig.tier_2_rate;
    excessDistanceMeters = distanceMeters - pricingConfig.tier_2_max_meters;
    excessDistanceFee = excessDistanceMeters * pricingConfig.tier_3_rate;
    distanceTier = 'tier_3';
  }

  const totalDistanceFee = baseTierFee + excessDistanceFee;
  
  // Apply essential mode discount
  let essentialModeDiscount = 0;
  if (isEssentialMode) {
    essentialModeDiscount = totalDistanceFee * (pricingConfig.essential_discount_percent / 100);
  }

  return {
    distanceFee: totalDistanceFee - essentialModeDiscount,
    distanceTier,
    baseTierFee,
    excessDistanceMeters,
    excessDistanceFee,
    essentialModeDiscount
  };
};

export const calculateDeliveryFee = async (
  params: Partial<DeliveryForm> & { isEssentialMode?: boolean }, 
  customerOrderCount: number = 0
): Promise<FeeCalculation> => {
  const {
    distanceMeters = '0',
    weightKg = '0',
    isBadWeather = false,
    isOffHour = false,
    isFastDelivery = false,
    manualDiscountPercent = '0',
    isEssentialMode = false
  } = params;

  // Validate and sanitize inputs
  const validDistance = Math.max(0, parseFloat(distanceMeters) || 0);
  const validWeight = Math.max(0, parseFloat(weightKg) || 0);
  const validDiscount = Math.min(100, Math.max(0, parseFloat(manualDiscountPercent) || 0));

  // Get pricing configuration
  const pricingConfig = await getPricingConfig();

  // Calculate tiered distance fee
  const tieredResult = calculateTieredDistanceFee(validDistance, pricingConfig, isEssentialMode);

  const weatherSurcharge = isBadWeather ? BAD_WEATHER_SURCHARGE : 0;
  const offHourSurcharge = isOffHour ? OFF_HOUR_SURCHARGE : 0;
  const expressBonus = isFastDelivery ? FAST_DELIVERY_BONUS : 0;
  
  let weightSurcharge = 0;
  if (validWeight > BASE_WEIGHT_KG) {
    weightSurcharge = (validWeight - BASE_WEIGHT_KG) * WEIGHT_SURCHARGE_PER_KG;
  }

  const totalSurcharges = weatherSurcharge + offHourSurcharge + weightSurcharge;
  const subtotal = tieredResult.distanceFee + totalSurcharges + expressBonus;
  
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
    distanceFee: tieredResult.distanceFee,
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
    
    // New tiered pricing fields
    distanceTier: tieredResult.distanceTier,
    baseTierFee: tieredResult.baseTierFee,
    excessDistanceMeters: tieredResult.excessDistanceMeters,
    excessDistanceFee: tieredResult.excessDistanceFee,
    isEssentialMode,
    essentialModeDiscount: tieredResult.essentialModeDiscount
  };
};

export const validateDeliveryForm = (form: DeliveryForm): string | null => {
  if (!form.customerName.trim()) return 'Customer name is required';
  if (!form.customerPhone.trim()) return 'Customer phone is required';
  if (!form.customerAddress.trim()) return 'Customer address is required';
  if (!form.distanceMeters || parseFloat(form.distanceMeters) <= 0) return 'Valid distance is required';
  return null;
};
