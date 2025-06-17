
import React, { useState, useEffect, useMemo } from 'react';
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

// Import new focused components
import AppHeader from './AppHeader';
import NavigationTabs from './NavigationTabs';
import TabContent from './TabContent';

const DeliveryManagementSystem = () => {
  // State Management
  const [customers, setCustomers] = useState<CustomerMap>({});
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ [key: string]: MonthlyData }>({});
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [cashOnHand, setCashOnHand] = useState(0);
  const [activeTab, setActiveTab] = useState('calculator');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    if (!monthlyData[currentMonth]) {
      setMonthlyData(prev => ({
        ...prev,
        [currentMonth]: {
          deliveries: [],
          totalRevenue: 0,
          totalProfit: 0,
          totalDeliveries: 0,
          totalDiscounts: 0,
          totalSurcharges: 0,
          expenses: 0,
          netIncome: 0,
          cashOnHandStart: cashOnHand
        }
      }));
    }
  }, [currentMonth, cashOnHand, monthlyData]);

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

    const deliveryRecord: Delivery = {
      id: Date.now(),
      date: new Date().toISOString(),
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
    
    setCustomers(prev => ({
      ...prev,
      [customerId]: {
        name: deliveryForm.customerName,
        phone: deliveryForm.customerPhone,
        address: deliveryForm.customerAddress,
        orderCount: (prev[customerId]?.orderCount || 0) + 1,
        totalSpent: (prev[customerId]?.totalSpent || 0) + feeCalculation.finalFee,
        lastOrderDate: new Date().toISOString(),
      }
    }));

    setDeliveries(prev => [...prev, deliveryRecord]);

    setMonthlyData(prev => {
      const monthData = prev[currentMonth] || {
        deliveries: [],
        totalRevenue: 0,
        totalProfit: 0,
        totalDeliveries: 0,
        totalDiscounts: 0,
        totalSurcharges: 0,
        expenses: 0,
        netIncome: 0,
        cashOnHandStart: 0
      };
      
      const newTotalRevenue = monthData.totalRevenue + feeCalculation.finalFee;
      const newTotalProfit = monthData.totalProfit + feeCalculation.profit;
      
      return {
        ...prev,
        [currentMonth]: {
          ...monthData,
          deliveries: [...monthData.deliveries, deliveryRecord],
          totalRevenue: newTotalRevenue,
          totalProfit: newTotalProfit,
          totalDeliveries: monthData.totalDeliveries + 1,
          totalDiscounts: monthData.totalDiscounts + feeCalculation.discountAmount + feeCalculation.autoDiscountAmount,
          totalSurcharges: monthData.totalSurcharges + feeCalculation.totalSurcharges,
          netIncome: newTotalRevenue - monthData.expenses
        }
      };
    });

    setCashOnHand(prev => prev + feeCalculation.finalFee);

    setDeliveryForm({
      customerName: '', customerPhone: '', customerAddress: '',
      orderDescription: '', distanceMeters: '', orderValue: '',
      weightKg: '', manualDiscountPercent: '', isBadWeather: false,
      isOffHour: false, isFastDelivery: false
    });

    const discountMessage = feeCalculation.autoDiscountAmount > 0 
      ? ` (includes ${feeCalculation.autoDiscountType}: ₹${feeCalculation.autoDiscountAmount.toFixed(2)} discount)`
      : '';
    
    alert(`Delivery processed! Final Fee: ₹${feeCalculation.finalFee.toFixed(2)}${discountMessage}`);
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
    
    setMonthlyData(prev => {
      const monthData = prev[currentMonth] || {
        deliveries: [],
        totalRevenue: 0,
        totalProfit: 0,
        totalDeliveries: 0,
        totalDiscounts: 0,
        totalSurcharges: 0,
        expenses: 0,
        netIncome: 0,
        cashOnHandStart: 0
      };
      
      const newExpenses = monthData.expenses + expenseAmount;
      
      return {
        ...prev,
        [currentMonth]: {
          ...monthData,
          expenses: newExpenses,
          netIncome: monthData.totalRevenue - newExpenses
        }
      };
    });

    setCashOnHand(prev => prev - expenseAmount);
    setExpenseForm({ description: '', amount: '', category: 'other' });
    alert(`Expense added: ₹${expenseAmount.toFixed(2)}`);
  };

  const startNewMonth = () => {
    if (window.confirm('Are you sure you want to start a new month? This action cannot be undone.')) {
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      setCurrentMonth(nextMonth.toISOString().slice(0, 7));
    }
  };

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
