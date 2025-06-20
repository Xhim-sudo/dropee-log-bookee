
import { supabase } from '../integrations/supabase/client';
import { DeliveryRecord } from './deliveryService';
import { ExpenseRecord } from './expenseService';

export interface MonthlyData {
  totalRevenue: number;
  totalProfit: number;
  totalDeliveries: number;
  totalDiscounts: number;
  totalSurcharges: number;
  expenses: number;
  netIncome: number;
  cashOnHandStart: number;
}

export const updateMonthlyWithDelivery = async (
  deliveryRecord: DeliveryRecord,
  currentMonth: string,
  monthlyData: { [key: string]: any },
  cashOnHand: number
): Promise<void> => {
  // Get current monthly data or initialize defaults
  const currentMonthData = monthlyData[currentMonth] || {
    totalRevenue: 0,
    totalProfit: 0,
    totalDeliveries: 0,
    totalDiscounts: 0,
    totalSurcharges: 0,
    expenses: 0,
    netIncome: 0,
    cashOnHandStart: cashOnHand
  };

  console.log('Current month data before update:', currentMonthData);

  // Calculate new values
  const newTotalDeliveries = currentMonthData.totalDeliveries + 1;
  const newTotalRevenue = currentMonthData.totalRevenue + deliveryRecord.finalFee;
  const newTotalProfit = currentMonthData.totalProfit + deliveryRecord.profit;
  const newTotalDiscounts = currentMonthData.totalDiscounts + deliveryRecord.discountAmount + deliveryRecord.autoDiscountAmount;
  const newTotalSurcharges = currentMonthData.totalSurcharges + deliveryRecord.totalSurcharges;
  const newNetIncome = newTotalRevenue - currentMonthData.expenses;

  console.log('Calculated new monthly values:', {
    newTotalDeliveries,
    newTotalRevenue,
    newTotalProfit,
    newTotalDiscounts,
    newTotalSurcharges,
    newNetIncome
  });

  // Update monthly summary with proper upsert handling
  const { error: monthlyError } = await supabase
    .from('monthly_summary')
    .upsert({
      month: currentMonth,
      total_deliveries: newTotalDeliveries,
      total_revenue: newTotalRevenue,
      total_profit: newTotalProfit,
      total_discounts: newTotalDiscounts,
      total_surcharges: newTotalSurcharges,
      total_expenses: currentMonthData.expenses,
      net_income: newNetIncome,
      cash_on_hand_start: currentMonthData.cashOnHandStart,
    }, {
      onConflict: 'month'
    });

  if (monthlyError) {
    console.error('Monthly summary upsert error:', monthlyError);
    throw monthlyError;
  }

  console.log('Monthly summary updated successfully');
};

export const updateMonthlyWithExpense = async (
  expense: ExpenseRecord,
  currentMonth: string,
  monthlyData: { [key: string]: any },
  cashOnHand: number
): Promise<void> => {
  // Get current monthly data
  const currentMonthData = monthlyData[currentMonth] || {
    totalRevenue: 0,
    totalProfit: 0,
    totalDeliveries: 0,
    totalDiscounts: 0,
    totalSurcharges: 0,
    expenses: 0,
    netIncome: 0,
    cashOnHandStart: cashOnHand
  };

  const newTotalExpenses = currentMonthData.expenses + expense.amount;
  const newNetIncome = currentMonthData.totalRevenue - newTotalExpenses;

  console.log('Updating monthly summary with new expense:', {
    newTotalExpenses,
    newNetIncome
  });

  const { error: monthlyError } = await supabase
    .from('monthly_summary')
    .upsert({
      month: currentMonth,
      total_deliveries: currentMonthData.totalDeliveries,
      total_revenue: currentMonthData.totalRevenue,
      total_profit: currentMonthData.totalProfit,
      total_discounts: currentMonthData.totalDiscounts,
      total_surcharges: currentMonthData.totalSurcharges,
      total_expenses: newTotalExpenses,
      net_income: newNetIncome,
      cash_on_hand_start: currentMonthData.cashOnHandStart,
    }, {
      onConflict: 'month'
    });

  if (monthlyError) {
    console.error('Monthly summary upsert error for expense:', monthlyError);
    throw monthlyError;
  }

  console.log('Monthly summary updated with expense successfully');
};
