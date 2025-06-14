
import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Users, TrendingUp, FileSpreadsheet, Package, Download } from 'lucide-react';
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
import { exportToExcel } from '../utils/excelExport';

// Import components
import DeliveryForm from './DeliveryForm';
import FeePreview from './FeePreview';
import CustomerList from './CustomerList';
import FinancialOverview from './FinancialOverview';
import RecentDeliveries from './RecentDeliveries';
import DataExport from './DataExport';

const DeliveryManagementSystem = () => {
  // State Management
  const [customers, setCustomers] = useState<CustomerMap>({});
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ [key: string]: MonthlyData }>({});
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [cashOnHand, setCashOnHand] = useState(0);
  const [activeTab, setActiveTab] = useState('calculator');

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

  // Initialize monthly data
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

    const feeCalculation = calculateDeliveryFee(deliveryForm);

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

    const customerId = `${deliveryForm.customerName.toLowerCase().trim()}_${deliveryForm.customerPhone}`;
    
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
          totalDiscounts: monthData.totalDiscounts + feeCalculation.discountAmount,
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

    alert(`Delivery processed! Final Fee: ₹${feeCalculation.finalFee.toFixed(2)}`);
  };

  // Add expense with validation
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

  // Start new month with confirmation
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
  
  const feePreview = useMemo(() => calculateDeliveryFee(deliveryForm), [deliveryForm]);

  // Tabs configuration
  const tabs = [
    { id: 'calculator', label: 'Fee Calculator', icon: Calculator },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'reports', label: 'Financials', icon: TrendingUp },
    { id: 'export', label: 'Data Export', icon: FileSpreadsheet }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dynamic Delivery System</h1>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="text-center md:text-right">
                <p className="text-sm text-gray-600">Current Month</p>
                <p className="text-lg font-semibold text-gray-800">{currentMonth}</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-gray-600">Cash on Hand</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">₹{cashOnHand.toFixed(2)}</p>
              </div>
              <button
                onClick={() => exportToExcel(deliveries, customers, monthlyData)}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>Export to Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-x-auto">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'calculator' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DeliveryForm
                deliveryForm={deliveryForm}
                setDeliveryForm={setDeliveryForm}
                onProcessDelivery={processDelivery}
              />
              <FeePreview
                feePreview={feePreview}
                deliveryForm={deliveryForm}
              />
            </div>
          )}

          {activeTab === 'customers' && (
            <CustomerList customers={customers} />
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <FinancialOverview
                currentMonthData={currentMonthData}
                expenseForm={expenseForm}
                setExpenseForm={setExpenseForm}
                onAddExpense={addExpense}
              />
              <RecentDeliveries deliveries={deliveries} />
            </div>
          )}

          {activeTab === 'export' && (
            <DataExport
              deliveries={deliveries}
              customers={customers}
              monthlyData={monthlyData}
              onStartNewMonth={startNewMonth}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryManagementSystem;
