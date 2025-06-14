
import * as XLSX from 'xlsx';
import { Delivery, Customer, MonthlyData } from '../types/delivery';
import { FUEL_COST_PER_DELIVERY, STAFF_SALARY_PER_DELIVERY, MAINTENANCE_COST_PER_DELIVERY } from './deliveryCalculations';

export const exportToExcel = (
  deliveries: Delivery[],
  customers: { [key: string]: Customer },
  monthlyData: { [key: string]: MonthlyData }
) => {
  if (deliveries.length === 0 && Object.keys(customers).length === 0) {
    alert('No data to export');
    return;
  }

  // Deliveries Sheet
  const deliveriesSheet = deliveries.map(d => ({
    'Delivery ID': d.id,
    'Date': new Date(d.date).toLocaleString(),
    'Customer Name': d.customerName,
    'Phone': d.customerPhone,
    'Address': d.customerAddress,
    'Order Description': d.orderDescription,
    'Distance (km)': d.distanceKm,
    'Weight (kg)': d.weightKg || 0,
    'Distance Fee (₹)': d.distanceFee,
    'Weather Surcharge (₹)': d.weatherSurcharge,
    'Off-Hour Surcharge (₹)': d.offHourSurcharge,
    'Weight Surcharge (₹)': d.weightSurcharge,
    'Express Bonus (₹)': d.expressBonus,
    'Subtotal (₹)': d.subtotal,
    'Discount (₹)': d.discountAmount,
    'Final Fee (₹)': d.finalFee,
    'Costs (₹)': d.totalCosts,
    'Profit (₹)': d.profit,
  }));

  // Profit Analysis Sheet
  const profitSheet = deliveries.map(d => ({
    'Delivery ID': d.id,
    'Date': new Date(d.date).toLocaleString(),
    'Customer Name': d.customerName,
    'Final Fee (₹)': d.finalFee,
    'Fuel Cost (₹)': FUEL_COST_PER_DELIVERY,
    'Staff Cost (₹)': STAFF_SALARY_PER_DELIVERY,
    'Maintenance Cost (₹)': MAINTENANCE_COST_PER_DELIVERY,
    'Total Costs (₹)': d.totalCosts,
    'Profit (₹)': d.profit,
  }));

  // Customers Sheet
  const customersSheet = Object.values(customers).map(c => ({
    'Name': c.name,
    'Phone': c.phone,
    'Address': c.address,
    'Total Orders': c.orderCount,
    'Total Spent (₹)': c.totalSpent,
    'Last Order': new Date(c.lastOrderDate).toLocaleDateString(),
  }));

  // Monthly Summary Sheet
  const monthlySheet = Object.entries(monthlyData).map(([month, data]) => ({
    'Month': month,
    'Total Revenue (₹)': data.totalRevenue,
    'Total Profit (₹)': data.totalProfit,
    'Total Deliveries': data.totalDeliveries,
    'Total Discounts (₹)': data.totalDiscounts,
    'Total Surcharges (₹)': data.totalSurcharges,
    'Other Expenses (₹)': data.expenses,
    'Net Income (₹)': data.netIncome,
  }));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(deliveriesSheet), "Deliveries");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(profitSheet), "Profit Analysis");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(customersSheet), "Customers");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(monthlySheet), "Monthly Summaries");

  XLSX.writeFile(wb, `delivery_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
