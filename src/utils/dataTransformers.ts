
import { CustomerMap, Delivery, MonthlyData } from '../types/delivery';

export const transformCustomersData = (customersData: any[]): CustomerMap => {
  const customerMap: CustomerMap = {};
  
  if (!Array.isArray(customersData)) {
    console.warn('customersData is not an array:', customersData);
    return customerMap;
  }
  
  customersData.forEach(customer => {
    if (!customer || !customer.name || !customer.phone) {
      console.warn('Invalid customer data:', customer);
      return;
    }
    
    const key = `${customer.name.toLowerCase().trim()}_${customer.phone}`;
    customerMap[key] = {
      name: customer.name,
      phone: customer.phone,
      address: customer.address || '',
      orderCount: customer.order_count || 0,
      totalSpent: customer.total_spent || 0,
      lastOrderDate: customer.last_order_date || new Date().toISOString(),
    };
  });
  
  console.log('Transformed customers data:', customerMap);
  return customerMap;
};

export const transformDeliveriesData = (deliveriesData: any[]): Delivery[] => {
  if (!Array.isArray(deliveriesData)) {
    console.warn('deliveriesData is not an array:', deliveriesData);
    return [];
  }
  
  const deliveries = deliveriesData.map(delivery => {
    if (!delivery) {
      console.warn('Invalid delivery data:', delivery);
      return null;
    }
    
    return {
      id: parseInt(delivery.id) || 0, // Convert UUID to number for compatibility
      date: delivery.delivery_date || new Date().toISOString(),
      customerName: delivery.customer_name || '',
      customerPhone: delivery.customer_phone || '',
      customerAddress: delivery.customer_address || '',
      orderDescription: delivery.order_description || '',
      distanceFee: delivery.distance_fee || 0,
      weatherSurcharge: delivery.weather_surcharge || 0,
      offHourSurcharge: delivery.off_hour_surcharge || 0,
      expressBonus: delivery.express_bonus || 0,
      weightSurcharge: delivery.weight_surcharge || 0,
      totalSurcharges: delivery.total_surcharges || 0,
      subtotal: delivery.subtotal || 0,
      discountAmount: delivery.discount_amount || 0,
      autoDiscountAmount: delivery.auto_discount_amount || 0,
      autoDiscountType: delivery.auto_discount_type || '',
      finalFee: delivery.final_fee || 0,
      totalCosts: delivery.total_costs || 0,
      profit: delivery.profit || 0,
      distanceKm: ((delivery.distance_meters || 0) / 1000).toFixed(2),
      month: delivery.month || '',
      orderValue: delivery.order_value || 0,
      weightKg: delivery.weight_kg || 0,
      manualDiscountPercent: delivery.manual_discount_percent || 0,
      isBadWeather: delivery.is_bad_weather || false,
      isOffHour: delivery.is_off_hour || false,
      isFastDelivery: delivery.is_fast_delivery || false,
      distanceMeters: delivery.distance_meters || 0,
    };
  }).filter(delivery => delivery !== null);
  
  console.log('Transformed deliveries data:', deliveries.length, 'deliveries');
  return deliveries;
};

export const transformMonthlyData = (data: any[], deliveriesData: any[]): { [key: string]: MonthlyData } => {
  const monthlyDataMap: { [key: string]: MonthlyData } = {};
  
  if (!Array.isArray(data)) {
    console.warn('monthly data is not an array:', data);
    return monthlyDataMap;
  }
  
  if (!Array.isArray(deliveriesData)) {
    console.warn('deliveriesData is not an array:', deliveriesData);
    deliveriesData = [];
  }
  
  data.forEach(month => {
    if (!month || !month.month) {
      console.warn('Invalid month data:', month);
      return;
    }
    
    monthlyDataMap[month.month] = {
      deliveries: deliveriesData.filter(d => d && d.month === month.month),
      totalRevenue: month.total_revenue || 0,
      totalProfit: month.total_profit || 0,
      totalDeliveries: month.total_deliveries || 0,
      totalDiscounts: month.total_discounts || 0,
      totalSurcharges: month.total_surcharges || 0,
      expenses: month.total_expenses || 0,
      netIncome: month.net_income || 0,
      cashOnHandStart: month.cash_on_hand_start || 0
    };
  });
  
  console.log('Transformed monthly data:', monthlyDataMap);
  return monthlyDataMap;
};
