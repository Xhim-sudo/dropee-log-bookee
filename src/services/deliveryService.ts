
import { supabase } from '../integrations/supabase/client';
import { CustomerMap, DeliveryForm } from '../types/delivery';
import { calculateDeliveryFee, validateDeliveryForm } from '../utils/deliveryCalculations';

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
}

export const processDeliveryRecord = async (
  deliveryRecord: DeliveryRecord,
  customers: CustomerMap
): Promise<DeliveryRecord> => {
  console.log('Processing delivery record:', deliveryRecord);
  
  try {
    // First, upsert customer
    const customerId = `${deliveryRecord.customerName.toLowerCase().trim()}_${deliveryRecord.customerPhone}`;
    const existingCustomer = customers[customerId];
    
    console.log('Upserting customer:', { customerId, existingCustomer });
    
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .upsert({
        name: deliveryRecord.customerName,
        phone: deliveryRecord.customerPhone,
        address: deliveryRecord.customerAddress,
        order_count: (existingCustomer?.orderCount || 0) + 1,
        total_spent: (existingCustomer?.totalSpent || 0) + deliveryRecord.finalFee,
        last_order_date: new Date().toISOString(),
      }, { 
        onConflict: 'name,phone',
      })
      .select()
      .single();

    if (customerError) {
      console.error('Customer upsert error:', customerError);
      throw customerError;
    }

    console.log('Customer upserted successfully:', customerData);

    // Insert delivery record
    const { error: deliveryError } = await supabase
      .from('deliveries')
      .insert({
        customer_id: customerData.id,
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
      });

    if (deliveryError) {
      console.error('Delivery insert error:', deliveryError);
      throw deliveryError;
    }

    console.log('Delivery inserted successfully');
    return deliveryRecord;

  } catch (error) {
    console.error('Error in processDeliveryRecord:', error);
    throw error;
  }
};

export const createDeliveryRecord = (
  deliveryForm: DeliveryForm,
  currentMonth: string,
  customers: CustomerMap
): DeliveryRecord => {
  console.log('Creating delivery record from form:', deliveryForm);
  
  const validationError = validateDeliveryForm(deliveryForm);
  if (validationError) {
    console.error('Validation error:', validationError);
    throw new Error(validationError);
  }

  const customerId = `${deliveryForm.customerName.toLowerCase().trim()}_${deliveryForm.customerPhone}`;
  const currentCustomerOrderCount = customers[customerId]?.orderCount || 0;

  console.log('Customer info:', { customerId, currentCustomerOrderCount });

  const feeCalculation = calculateDeliveryFee(deliveryForm, currentCustomerOrderCount);
  console.log('Fee calculation result:', feeCalculation);

  const deliveryRecord: DeliveryRecord = {
    customerName: deliveryForm.customerName,
    customerPhone: deliveryForm.customerPhone,
    customerAddress: deliveryForm.customerAddress,
    orderDescription: deliveryForm.orderDescription,
    distanceMeters: parseFloat(deliveryForm.distanceMeters),
    orderValue: parseFloat(deliveryForm.orderValue || '0'),
    weightKg: parseFloat(deliveryForm.weightKg || '0'),
    manualDiscountPercent: parseFloat(deliveryForm.manualDiscountPercent || '0'),
    isBadWeather: deliveryForm.isBadWeather,
    isOffHour: deliveryForm.isOffHour,
    isFastDelivery: deliveryForm.isFastDelivery,
    month: currentMonth,
    ...feeCalculation
  };
  
  console.log('Final delivery record created:', deliveryRecord);
  return deliveryRecord;
};
