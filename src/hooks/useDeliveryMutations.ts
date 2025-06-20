
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { CustomerMap, DeliveryForm as DeliveryFormType, ExpenseForm } from '../types/delivery';
import { calculateDeliveryFee, validateDeliveryForm } from '../utils/deliveryCalculations';

export const useDeliveryMutations = (
  customers: CustomerMap,
  monthlyData: { [key: string]: any },
  currentMonth: string,
  cashOnHand: number,
  setDeliveryForm: (form: DeliveryFormType) => void,
  setExpenseForm: (form: ExpenseForm) => void,
  setCashOnHand: (value: number | ((prev: number) => number)) => void
) => {
  const queryClient = useQueryClient();

  // Process delivery mutation
  const processDeliveryMutation = useMutation({
    mutationFn: async (deliveryRecord: any) => {
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
        return deliveryRecord;

      } catch (error) {
        console.error('Error in processDeliveryMutation:', error);
        throw error;
      }
    },
    onSuccess: (deliveryRecord) => {
      console.log('Delivery processed successfully:', deliveryRecord);
      
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['monthly_summary'] });
      
      setCashOnHand(prev => prev + deliveryRecord.finalFee);
      
      setDeliveryForm({
        customerName: '', customerPhone: '', customerAddress: '',
        orderDescription: '', distanceMeters: '', orderValue: '',
        weightKg: '', manualDiscountPercent: '', isBadWeather: false,
        isOffHour: false, isFastDelivery: false
      });

      const discountMessage = deliveryRecord.autoDiscountAmount > 0 
        ? ` (includes ${deliveryRecord.autoDiscountType}: ₹${deliveryRecord.autoDiscountAmount.toFixed(2)} discount)`
        : '';
      
      alert(`Delivery processed! Final Fee: ₹${deliveryRecord.finalFee.toFixed(2)}${discountMessage}`);
    },
    onError: (error) => {
      console.error('Delivery processing failed:', error);
      alert(`Failed to process delivery: ${error.message || 'Unknown error'}`);
    }
  });

  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: async (expense: { description: string; amount: number; category: string }) => {
      console.log('Adding expense:', expense);
      
      try {
        const { error } = await supabase
          .from('expenses')
          .insert({
            month: currentMonth,
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
          });

        if (error) {
          console.error('Expense insert error:', error);
          throw error;
        }

        console.log('Expense inserted successfully');

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
        return expense;

      } catch (error) {
        console.error('Error in addExpenseMutation:', error);
        throw error;
      }
    },
    onSuccess: (expense) => {
      console.log('Expense added successfully:', expense);
      queryClient.invalidateQueries({ queryKey: ['monthly_summary'] });
      setCashOnHand(prev => prev - expense.amount);
      setExpenseForm({ description: '', amount: '', category: 'other' });
      alert(`Expense added: ₹${expense.amount.toFixed(2)}`);
    },
    onError: (error) => {
      console.error('Expense addition failed:', error);
      alert(`Failed to add expense: ${error.message || 'Unknown error'}`);
    }
  });

  const processDelivery = (deliveryForm: DeliveryFormType) => {
    console.log('Processing delivery form:', deliveryForm);
    
    const validationError = validateDeliveryForm(deliveryForm);
    if (validationError) {
      console.error('Validation error:', validationError);
      alert(validationError);
      return;
    }

    const customerId = `${deliveryForm.customerName.toLowerCase().trim()}_${deliveryForm.customerPhone}`;
    const currentCustomerOrderCount = customers[customerId]?.orderCount || 0;

    console.log('Customer info:', { customerId, currentCustomerOrderCount });

    const feeCalculation = calculateDeliveryFee(deliveryForm, currentCustomerOrderCount);
    console.log('Fee calculation result:', feeCalculation);

    const deliveryRecord = {
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
    
    console.log('Final delivery record to process:', deliveryRecord);
    processDeliveryMutation.mutate(deliveryRecord);
  };

  const addExpense = (expenseForm: ExpenseForm) => {
    console.log('Adding expense form:', expenseForm);
    
    const { description, amount } = expenseForm;
    
    if (!description.trim() || !amount) {
      console.error('Validation error: Missing expense fields');
      alert('Please fill all expense fields');
      return;
    }

    const expenseAmount = parseFloat(amount);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      console.error('Validation error: Invalid expense amount');
      alert('Please enter a valid expense amount');
      return;
    }
    
    addExpenseMutation.mutate({
      description,
      amount: expenseAmount,
      category: expenseForm.category
    });
  };

  return {
    processDelivery,
    addExpense,
    processDeliveryMutation,
    addExpenseMutation
  };
};
