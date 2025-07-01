
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CustomerMap, DeliveryForm as DeliveryFormType, ExpenseForm } from '../types/delivery';
import { processDeliveryRecord, createDeliveryRecord } from '../services/deliveryService';
import { processExpenseRecord, createExpenseRecord } from '../services/expenseService';
import { updateMonthlyWithDelivery, updateMonthlyWithExpense } from '../services/monthlyService';

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
      try {
        // Process the delivery record
        const processedDelivery = await processDeliveryRecord(deliveryRecord, customers);
        
        // Update monthly summary
        await updateMonthlyWithDelivery(processedDelivery, currentMonth, monthlyData, cashOnHand);
        
        return processedDelivery;

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
        isOffHour: false, isFastDelivery: false, vendorId: ''
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
      try {
        // Process the expense record
        const processedExpense = await processExpenseRecord(expense, currentMonth);
        
        // Update monthly summary
        await updateMonthlyWithExpense(processedExpense, currentMonth, monthlyData, cashOnHand);
        
        return processedExpense;

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
    
    try {
      const deliveryRecord = createDeliveryRecord(deliveryForm, currentMonth, customers);
      processDeliveryMutation.mutate(deliveryRecord);
    } catch (error) {
      console.error('Error creating delivery record:', error);
      alert(`Failed to process delivery: ${error.message}`);
    }
  };

  const addExpense = (expenseForm: ExpenseForm) => {
    console.log('Adding expense form:', expenseForm);
    
    try {
      const expenseRecord = createExpenseRecord(expenseForm);
      addExpenseMutation.mutate(expenseRecord);
    } catch (error) {
      console.error('Error creating expense record:', error);
      alert(`Failed to add expense: ${error.message}`);
    }
  };

  return {
    processDelivery,
    addExpense,
    processDeliveryMutation,
    addExpenseMutation
  };
};
