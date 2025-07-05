
import { supabase } from '../integrations/supabase/client';

export interface DeliveryRecord {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderDescription: string;
  distanceMeters: number;
  orderValue: number;
  weightKg: number;
  manualDiscountPercent: number;
  isBadWeather: boolean;
  isOffHour: boolean;
  isFastDelivery: boolean;
  month: string;
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
  
  // Enhanced tracking fields
  vendorId?: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  autoDistanceMeters?: number;
  distanceSource?: string;
}

export const insertDeliveryRecord = async (
  deliveryRecord: DeliveryRecord,
  customerId: string
) => {
  const { error: deliveryError } = await supabase
    .from('deliveries')
    .insert({
      customer_id: customerId,
      customer_name: deliveryRecord.customerName,
      customer_phone: deliveryRecord.customerPhone,
      customer_address: deliveryRecord.customerAddress,
      order_description: deliveryRecord.orderDescription,
      distance_meters: deliveryRecord.distanceMeters,
      order_value: deliveryRecord.orderValue,
      weight_kg: deliveryRecord.weightKg,
      manual_discount_percent: deliveryRecord.manualDiscountPercent,
      is_bad_weather: deliveryRecord.isBadWeather,
      is_off_hour: deliveryRecord.isOffHour,
      is_fast_delivery: deliveryRecord.isFastDelivery,
      distance_fee: deliveryRecord.distanceFee,
      weather_surcharge: deliveryRecord.weatherSurcharge,
      off_hour_surcharge: deliveryRecord.offHourSurcharge,
      express_bonus: deliveryRecord.expressBonus,
      weight_surcharge: deliveryRecord.weightSurcharge,
      total_surcharges: deliveryRecord.totalSurcharges,
      subtotal: deliveryRecord.subtotal,
      discount_amount: deliveryRecord.discountAmount,
      auto_discount_amount: deliveryRecord.autoDiscountAmount,
      auto_discount_type: deliveryRecord.autoDiscountType,
      final_fee: deliveryRecord.finalFee,
      total_costs: deliveryRecord.totalCosts,
      profit: deliveryRecord.profit,
      month: deliveryRecord.month,
      
      // Enhanced tracking data
      vendor_id: deliveryRecord.vendorId || null,
      pickup_latitude: deliveryRecord.pickupLatitude || null,
      pickup_longitude: deliveryRecord.pickupLongitude || null,
      delivery_latitude: deliveryRecord.deliveryLatitude || null,
      delivery_longitude: deliveryRecord.deliveryLongitude || null,
      start_time: deliveryRecord.startTime || null,
      end_time: deliveryRecord.endTime || null,
      duration_minutes: deliveryRecord.durationMinutes || null,
      auto_distance_meters: deliveryRecord.autoDistanceMeters || null,
      distance_source: deliveryRecord.distanceSource || 'manual',
    });

  if (deliveryError) {
    console.error('Delivery insert error:', deliveryError);
    throw deliveryError;
  }

  console.log('Enhanced delivery inserted successfully');
};
