import React, { useState, useMemo, useEffect } from 'react';
import { 
  DeliveryForm as DeliveryFormType, 
  ExpenseForm 
} from '../types/delivery';
import { calculateDeliveryFee, FeeCalculation } from '../utils/deliveryCalculations';

// Import new focused hooks
import { useDeliveryData } from '../hooks/useDeliveryData';
import { useDeliveryMutations } from '../hooks/useDeliveryMutations';
import { useMonthManagement } from '../hooks/useMonthManagement';

// Import new focused components
import AppHeader from './AppHeader';
import NavigationTabs from './NavigationTabs';
import TabContent from './TabContent';

const DeliveryManagementSystem = () => {
  // State Management
  const [cashOnHand, setCashOnHand] = useState(0);
  const [activeTab, setActiveTab] = useState('calculator');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [feePreview, setFeePreview] = useState<FeeCalculation>({
    distanceFee: 0,
    weatherSurcharge: 0,
    offHourSurcharge: 0,
    expressBonus: 0,
    weightSurcharge: 0,
    totalSurcharges: 0,
    subtotal: 0,
    discountAmount: 0,
    autoDiscountAmount: 0,
    autoDiscountType: '',
    finalFee: 0,
    totalCosts: 0,
    profit: 0,
    distanceKm: '0.00',
    distanceTier: undefined,
    baseTierFee: undefined,
    excessDistanceMeters: undefined,
    excessDistanceFee: undefined,
    isEssentialMode: false,
    essentialModeDiscount: undefined
  });

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
    vendorId: '', // Initialize vendor field
  });

  const [expenseForm, setExpenseForm] = useState<ExpenseForm>({
    description: '',
    amount: '',
    category: 'other'
  });

  // Custom hooks for data and business logic
  const { customers, deliveries, monthlyData } = useDeliveryData();
  const { currentMonth, startNewMonth } = useMonthManagement(monthlyData, cashOnHand);
  const { processDelivery, addExpense } = useDeliveryMutations(
    customers,
    monthlyData,
    currentMonth,
    cashOnHand,
    setDeliveryForm,
    setExpenseForm,
    setCashOnHand
  );

  // Effect to calculate fee preview when form changes
  useEffect(() => {
    const calculateFeePreview = async () => {
      try {
        const customerId = `${deliveryForm.customerName.toLowerCase().trim()}_${deliveryForm.customerPhone}`;
        const currentCustomerOrderCount = customers[customerId]?.orderCount || 0;
        const calculation = await calculateDeliveryFee(deliveryForm, currentCustomerOrderCount);
        setFeePreview(calculation);
      } catch (error) {
        console.error('Error calculating fee preview:', error);
        // Keep the previous preview or set to default values on error
      }
    };

    calculateFeePreview();
  }, [deliveryForm, customers]);

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
          onProcessDelivery={() => processDelivery(deliveryForm)}
          feePreview={feePreview}
          customers={customers}
          deliveries={deliveries}
          currentMonthData={currentMonthData}
          expenseForm={expenseForm}
          setExpenseForm={setExpenseForm}
          onAddExpense={() => addExpense(expenseForm)}
          monthlyData={monthlyData}
          onStartNewMonth={startNewMonth}
        />
      </div>
    </div>
  );
};

export default DeliveryManagementSystem;
