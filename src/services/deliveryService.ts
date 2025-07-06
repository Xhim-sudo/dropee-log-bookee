
import { CustomerMap, DeliveryForm } from '../types/delivery';
import { calculateDeliveryFee, validateDeliveryForm } from '../utils/deliveryCalculations';
import { upsertCustomer } from './customerService';
import { insertDeliveryRecord, DeliveryRecord } from './deliveryRecordService';

export type { DeliveryRecord } from './deliveryRecordService';

export const processDeliveryRecord = async (
  deliveryRecord: DeliveryRecord,
  customers: CustomerMap
): Promise<DeliveryRecord> => {
  console.log('Processing enhanced delivery record with tiered pricing:', deliveryRecord);
  
  try {
    // First, upsert customer
    const customerData = await upsertCustomer(
      deliveryRecord.customerName,
      deliveryRecord.customerPhone,
      deliveryRecord.customerAddress,
      deliveryRecord.finalFee,
      customers
    );

    // Insert enhanced delivery record
    await insertDeliveryRecord(deliveryRecord, customerData.id);

    return deliveryRecord;

  } catch (error) {
    console.error('Error in processDeliveryRecord:', error);
    throw error;
  }
};

export const createDeliveryRecord = async (
  deliveryForm: DeliveryForm & {
    startTime?: string;
    endTime?: string;
    durationMinutes?: number;
    pickupLatitude?: number;
    pickupLongitude?: number;
    deliveryLatitude?: number;
    deliveryLongitude?: number;
    autoDistanceMeters?: number;
    distanceSource?: string;
  },
  currentMonth: string,
  customers: CustomerMap
): Promise<DeliveryRecord> => {
  console.log('Creating enhanced delivery record with tiered pricing from form:', deliveryForm);
  
  const validationError = validateDeliveryForm(deliveryForm);
  if (validationError) {
    console.error('Validation error:', validationError);
    throw new Error(validationError);
  }

  const customerId = `${deliveryForm.customerName.toLowerCase().trim()}_${deliveryForm.customerPhone}`;
  const currentCustomerOrderCount = customers[customerId]?.orderCount || 0;

  console.log('Customer info:', { customerId, currentCustomerOrderCount });

  // Calculate fees using new tiered pricing system
  const feeCalculation = await calculateDeliveryFee(deliveryForm, currentCustomerOrderCount);
  console.log('Tiered fee calculation result:', feeCalculation);

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
    ...feeCalculation,
    
    // Enhanced tracking data
    vendorId: deliveryForm.vendorId || undefined,
    pickupLatitude: deliveryForm.pickupLatitude,
    pickupLongitude: deliveryForm.pickupLongitude,
    deliveryLatitude: deliveryForm.deliveryLatitude,
    deliveryLongitude: deliveryForm.deliveryLongitude,
    startTime: deliveryForm.startTime,
    endTime: deliveryForm.endTime,
    durationMinutes: deliveryForm.durationMinutes,
    autoDistanceMeters: deliveryForm.autoDistanceMeters,
    distanceSource: deliveryForm.distanceSource || 'manual',
    
    // New tiered pricing fields
    distanceTier: feeCalculation.distanceTier,
    baseTierFee: feeCalculation.baseTierFee,
    excessDistanceMeters: feeCalculation.excessDistanceMeters,
    excessDistanceFee: feeCalculation.excessDistanceFee,
    isEssentialMode: feeCalculation.isEssentialMode,
    essentialModeDiscount: feeCalculation.essentialModeDiscount
  };
  
  console.log('Final enhanced delivery record with tiered pricing created:', deliveryRecord);
  return deliveryRecord;
};
