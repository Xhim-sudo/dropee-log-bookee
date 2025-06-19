
import { CustomerMap, Delivery, MonthlyData } from '../types/delivery';

export const transformCustomersData = (customersData: any[]): CustomerMap => {
  const customerMap: CustomerMap = {};
  customersData.forEach(customer => {
    const key = `${customer.name.toLowerCase().trim()}_${customer.phone}`;
    customerMap[key] = {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      orderCount: customer.order_count,
      totalSpent: customer.total_spent,
      lastOrderDate: customer.last_order_date || new Date().toISOString(),
    };
  });
  return customerMap;
};

export const transformDeliveriesData = (deliveriesData: any[]): Delivery[] => {
  return deliveriesData.map(delivery => ({
    id: parseInt(delivery.id) || 0, // Convert UUID to number for compatibility
    date: delivery.delivery_date,
    customerName: delivery.customer_name,
    customerPhone: delivery.customer_phone,
    customerAddress: delivery.customer_address,
    orderDescription: delivery.order_description || '',
    distanceFee: delivery.distance_fee,
    weatherSurcharge: delivery.weather_surcharge,
    offHourSurcharge: delivery.off_hour_surcharge,
    expressBonus: delivery.express_bonus,
    weightSurcharge: delivery.weight_surcharge,
    totalSurcharges: delivery.total_surcharges,
    subtotal: delivery.subtotal,
    discountAmount: delivery.discount_amount,
    autoDiscountAmount: delivery.auto_discount_amount,
    autoDiscountType: delivery.auto_discount_type || '',
    finalFee: delivery.final_fee,
    totalCosts: delivery.total_costs,
    profit: delivery.profit,
    distanceKm: (delivery.distance_meters / 1000).toFixed(2),
    month: delivery.month,
    orderValue: delivery.order_value,
    weightKg: delivery.weight_kg,
    manualDiscountPercent: delivery.manual_discount_percent,
    isBadWeather: delivery.is_bad_weather,
    isOffHour: delivery.is_off_hour,
    isFastDelivery: delivery.is_fast_delivery,
    distanceMeters: delivery.distance_meters,
  }));
};

export const transformMonthlyData = (data: any[], deliveriesData: any[]): { [key: string]: MonthlyData } => {
  const monthlyDataMap: { [key: string]: MonthlyData } = {};
  data.forEach(month => {
    monthlyDataMap[month.month] = {
      deliveries: deliveriesData.filter(d => d.month === month.month),
      totalRevenue: month.total_revenue,
      totalProfit: month.total_profit,
      totalDeliveries: month.total_deliveries,
      totalDiscounts: month.total_discounts,
      totalSurcharges: month.total_surcharges,
      expenses: month.total_expenses,
      netIncome: month.net_income,
      cashOnHandStart: month.cash_on_hand_start
    };
  });
  return monthlyDataMap;
};
