
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CustomerMap, 
  Delivery, 
  MonthlyData, 
  DeliveryForm as DeliveryFormType, 
  ExpenseForm 
} from '../types/delivery';
import { 
  calculateDeliveryFee, 
  validateDeliveryForm
} from '../utils/deliveryCalculations';
import { supabase } from '../integrations/supabase/client';

// Import new focused components
import AppHeader from './AppHeader';
import NavigationTabs from './NavigationTabs';
import TabContent from './TabContent';

const DeliveryManagementSystem = () => {
  // State Management
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [cashOnHand, setCashOnHand] = useState(0);
  const [activeTab, setActiveTab] = useState('calculator');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const queryClient = useQueryClient();

  const [deliveryForm, setDeliveryForm] = useState<DeliveryFormType>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    orderDescription: '',
    distanceMeters: '',
    orderValue: '',
    weightKg: '',
    manualDiscountPercent: '',
    isBadWeather: false,
    isOffHour: false,
    isFastDelivery: false,
  });

  const [expenseForm, setExpenseForm] = useState<ExpenseForm>({
    description: '',
    amount: '',
    category: 'other'
  });

  // Fetch customers
  const { data: customersData = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch deliveries
  const { data: deliveriesData = [] } = useQuery({
    queryKey: ['deliveries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deliveries')
        .select('*')
        .order('delivery_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch monthly summary
  const { data: monthlyData = {} } = useQuery({
    queryKey: ['monthly_summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_summary')
        .select('*');
      
      if (error) throw error;
      
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
    }
  });

  // Convert customers array to CustomerMap
  const customers: CustomerMap = useMemo(() => {
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
  }, [customersData]);

  // Convert deliveries data to proper format
  const deliveries: Delivery[] = useMemo(() => {
    return deliveriesData.map(delivery => ({
      id: delivery.id,
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
  }, [deliveriesData]);

  // Process delivery mutation
  const processDeliveryMutation = useMutation({
    mutationFn: async (deliveryRecord: any) => {
      // First, upsert customer
      const customerId = `${deliveryRecord.customerName.toLowerCase().trim()}_${deliveryRecord.customerPhone}`;
      const existingCustomer = customers[customerId];
      
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

      if (customerError) throw customerError;

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

      if (deliveryError) throw deliveryError;

      // Update or create monthly summary
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

      const { error: monthlyError } = await supabase
        .from('monthly_summary')
        .upsert({
          month: currentMonth,
          total_deliveries: currentMonthData.totalDeliveries + 1,
          total_revenue: currentMonthData.totalRevenue + deliveryRecord.finalFee,
          total_profit: currentMonthData.totalProfit + deliveryRecord.profit,
          total_discounts: currentMonthData.totalDiscounts + deliveryRecord.discountAmount + deliveryRecord.autoDiscountAmount,
          total_surcharges: currentMonthData.totalSurcharges + deliveryRecord.totalSurcharges,
          total_expenses: currentMonthData.expenses,
          net_income: (currentMonthData.totalRevenue + deliveryRecord.finalFee) - currentMonthData.expenses,
          cash_on_hand_start: currentMonthData.cashOnHandStart,
        });

      if (monthlyError) throw monthlyError;

      return deliveryRecord;
    },
    onSuccess: (deliveryRecord) => {
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
    }
  });

  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: async (expense: { description: string; amount: number; category: string }) => {
      const { error } = await supabase
        .from('expenses')
        .insert({
          month: currentMonth,
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
        });

      if (error) throw error;

      // Update monthly summary
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

      const { error: monthlyError } = await supabase
        .from('monthly_summary')
        .upsert({
          month: currentMonth,
          total_deliveries: currentMonthData.totalDeliveries,
          total_revenue: currentMonthData.totalRevenue,
          total_profit: currentMonthData.totalProfit,
          total_discounts: currentMonthData.totalDiscounts,
          total_surcharges: currentMonthData.totalSurcharges,
          total_expenses: currentMonthData.expenses + expense.amount,
          net_income: currentMonthData.totalRevenue - (currentMonthData.expenses + expense.amount),
          cash_on_hand_start: currentMonthData.cashOnHandStart,
        });

      if (monthlyError) throw monthlyError;

      return expense;
    },
    onSuccess: (expense) => {
      queryClient.invalidateQueries({ queryKey: ['monthly_summary'] });
      setCashOnHand(prev => prev - expense.amount);
      setExpenseForm({ description: '', amount: '', category: 'other' });
      alert(`Expense added: ₹${expense.amount.toFixed(2)}`);
    }
  });

  // Process delivery with validation
  const processDelivery = () => {
    const validationError = validateDeliveryForm(deliveryForm);
    if (validationError) {
      alert(validationError);
      return;
    }

    const customerId = `${deliveryForm.customerName.toLowerCase().trim()}_${deliveryForm.customerPhone}`;
    const currentCustomerOrderCount = customers[customerId]?.orderCount || 0;

    const feeCalculation = calculateDeliveryFee(deliveryForm, currentCustomerOrderCount);

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
    
    processDeliveryMutation.mutate(deliveryRecord);
  };

  const addExpense = () => {
    const { description, amount } = expenseForm;
    
    if (!description.trim() || !amount) {
      alert('Please fill all expense fields');
      return;
    }

    const expenseAmount = parseFloat(amount);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      alert('Please enter a valid expense amount');
      return;
    }
    
    addExpenseMutation.mutate({
      description,
      amount: expenseAmount,
      category: expenseForm.category
    });
  };

  const startNewMonth = () => {
    if (window.confirm('Are you sure you want to start a new month? This action cannot be undone.')) {
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      setCurrentMonth(nextMonth.toISOString().slice(0, 7));
    }
  };

  // Initialize current month data if it doesn't exist
  useEffect(() => {
    if (!monthlyData[currentMonth]) {
      const initializeMonth = async () => {
        const { error } = await supabase
          .from('monthly_summary')
          .upsert({
            month: currentMonth,
            total_deliveries: 0,
            total_revenue: 0,
            total_profit: 0,
            total_discounts: 0,
            total_surcharges: 0,
            total_expenses: 0,
            net_income: 0,
            cash_on_hand_start: cashOnHand,
          });

        if (!error) {
          queryClient.invalidateQueries({ queryKey: ['monthly_summary'] });
        }
      };

      initializeMonth();
    }
  }, [currentMonth, cashOnHand, monthlyData, queryClient]);

  // Memoized calculations for performance
  const currentMonthData = useMemo(() => 
    monthlyData[currentMonth] || {
      deliveries: [],
      totalRevenue: 0,
      totalProfit: 0,
      totalDeliveries: 0,
      totalDiscounts: 0,
      totalSurcharges: 0,
      expenses: 0,
      netIncome: 0,
      cashOnHandStart: 0
    }, 
    [monthlyData, currentMonth]
  );
  
  const feePreview = useMemo(() => {
    const customerId = `${deliveryForm.customerName.toLowerCase().trim()}_${deliveryForm.customerPhone}`;
    const currentCustomerOrderCount = customers[customerId]?.orderCount || 0;
    return calculateDeliveryFee(deliveryForm, currentCustomerOrderCount);
  }, [deliveryForm, customers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-2 sm:p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <AppHeader
          currentMonth={currentMonth}
          cashOnHand={cashOnHand}
          deliveries={deliveries}
          customers={customers}
          monthlyData={monthlyData}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <TabContent
          activeTab={activeTab}
          deliveryForm={deliveryForm}
          setDeliveryForm={setDeliveryForm}
          onProcessDelivery={processDelivery}
          feePreview={feePreview}
          customers={customers}
          deliveries={deliveries}
          currentMonthData={currentMonthData}
          expenseForm={expenseForm}
          setExpenseForm={setExpenseForm}
          onAddExpense={addExpense}
          monthlyData={monthlyData}
          onStartNewMonth={startNewMonth}
        />
      </div>
    </div>
  );
};

export default DeliveryManagementSystem;
