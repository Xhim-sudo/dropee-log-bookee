
import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, FileSpreadsheet, TrendingUp, Package, Users, DollarSign, Calendar, Download, Zap, CloudDrizzle, Clock, MapPin, Phone, Star } from 'lucide-react';
import { 
  CustomerMap, 
  Delivery, 
  MonthlyData, 
  DeliveryForm, 
  ExpenseForm 
} from '../types/delivery';
import { 
  calculateDeliveryFee, 
  validateDeliveryForm,
  BAD_WEATHER_SURCHARGE,
  OFF_HOUR_SURCHARGE,
  FAST_DELIVERY_BONUS,
  BASE_WEIGHT_KG
} from '../utils/deliveryCalculations';
import { exportToExcel } from '../utils/excelExport';

const DeliveryManagementSystem = () => {
  // State Management
  const [customers, setCustomers] = useState<CustomerMap>({});
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ [key: string]: MonthlyData }>({});
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [cashOnHand, setCashOnHand] = useState(0);
  const [activeTab, setActiveTab] = useState('calculator');

  const [deliveryForm, setDeliveryForm] = useState<DeliveryForm>({
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

  const recentDeliveries = useMemo(() => 
    [...deliveries].reverse().slice(0, 10), 
    [deliveries]
  );

  const topCustomers = useMemo(() => 
    Object.values(customers)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5), 
    [customers]
  );

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
              {/* Delivery Form */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Calculator className="h-6 w-6 mr-3 text-indigo-600" />
                  New Delivery Order
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer Info */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                    <input 
                      type="text" 
                      value={deliveryForm.customerName} 
                      onChange={(e) => setDeliveryForm(prev => ({ ...prev, customerName: e.target.value }))} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
                      placeholder="Enter customer name" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input 
                      type="tel" 
                      value={deliveryForm.customerPhone} 
                      onChange={(e) => setDeliveryForm(prev => ({ ...prev, customerPhone: e.target.value }))} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
                      placeholder="Enter phone number" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Distance (Meters) *</label>
                    <input 
                      type="number" 
                      min="0"
                      value={deliveryForm.distanceMeters} 
                      onChange={(e) => setDeliveryForm(prev => ({ ...prev, distanceMeters: e.target.value }))} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
                      placeholder="e.g., 2500" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Address *</label>
                    <textarea 
                      value={deliveryForm.customerAddress} 
                      onChange={(e) => setDeliveryForm(prev => ({ ...prev, customerAddress: e.target.value }))} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none" 
                      placeholder="Enter full delivery address" 
                      rows={2}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Description</label>
                    <input 
                      type="text" 
                      value={deliveryForm.orderDescription} 
                      onChange={(e) => setDeliveryForm(prev => ({ ...prev, orderDescription: e.target.value }))} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
                      placeholder="e.g., Food delivery, Package, etc." 
                    />
                  </div>
                  
                  {/* Order Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <input 
                      type="number" 
                      min="0"
                      step="0.1"
                      value={deliveryForm.weightKg} 
                      onChange={(e) => setDeliveryForm(prev => ({ ...prev, weightKg: e.target.value }))} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
                      placeholder={`Base: ${BASE_WEIGHT_KG}kg`} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      value={deliveryForm.manualDiscountPercent} 
                      onChange={(e) => setDeliveryForm(prev => ({ ...prev, manualDiscountPercent: e.target.value }))} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
                      placeholder="e.g., 10" 
                    />
                  </div>

                  {/* Surcharge Toggles */}
                  <div className="md:col-span-2 space-y-3 pt-2">
                    <h3 className="text-sm font-medium text-gray-700">Additional Charges & Conditions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input 
                          type="checkbox" 
                          checked={deliveryForm.isBadWeather} 
                          onChange={(e) => setDeliveryForm(prev => ({ ...prev, isBadWeather: e.target.checked }))} 
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded" 
                        />
                        <CloudDrizzle className="h-4 w-4 ml-2 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-600">Bad Weather (+₹{BAD_WEATHER_SURCHARGE})</span>
                      </label>
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input 
                          type="checkbox" 
                          checked={deliveryForm.isOffHour} 
                          onChange={(e) => setDeliveryForm(prev => ({ ...prev, isOffHour: e.target.checked }))} 
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded" 
                        />
                        <Clock className="h-4 w-4 ml-2 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-600">Off-Hour (+₹{OFF_HOUR_SURCHARGE})</span>
                      </label>
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input 
                          type="checkbox" 
                          checked={deliveryForm.isFastDelivery} 
                          onChange={(e) => setDeliveryForm(prev => ({ ...prev, isFastDelivery: e.target.checked }))} 
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded" 
                        />
                        <Zap className="h-4 w-4 ml-2 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-600">Express (+₹{FAST_DELIVERY_BONUS})</span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <button 
                      onClick={processDelivery} 
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <Package className="h-5 w-5" />
                      <span>Process Delivery & Calculate Fee</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Fee & Profit Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Live Calculation</h3>
                
                <div className="space-y-3">
                  {/* Base Fee */}
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Distance Fee ({feePreview.distanceKm} km)</span>
                    <span className="font-medium">₹{feePreview.distanceFee.toFixed(2)}</span>
                  </div>

                  {/* Surcharges */}
                  {(feePreview.totalSurcharges > 0 || feePreview.expressBonus > 0) && (
                    <div className="py-2 border-b">
                      <span className="text-gray-600 font-medium">Surcharges & Bonuses</span>
                      {feePreview.weatherSurcharge > 0 && <div className="flex justify-between text-sm mt-1"><span className="text-gray-500 pl-2">› Bad Weather</span><span className="font-medium text-amber-600">+ ₹{feePreview.weatherSurcharge.toFixed(2)}</span></div>}
                      {feePreview.offHourSurcharge > 0 && <div className="flex justify-between text-sm mt-1"><span className="text-gray-500 pl-2">› Off-Hour</span><span className="font-medium text-amber-600">+ ₹{feePreview.offHourSurcharge.toFixed(2)}</span></div>}
                      {feePreview.weightSurcharge > 0 && <div className="flex justify-between text-sm mt-1"><span className="text-gray-500 pl-2">› Overweight</span><span className="font-medium text-amber-600">+ ₹{feePreview.weightSurcharge.toFixed(2)}</span></div>}
                      {feePreview.expressBonus > 0 && <div className="flex justify-between text-sm mt-1"><span className="text-gray-500 pl-2">› Express Bonus</span><span className="font-medium text-amber-600">+ ₹{feePreview.expressBonus.toFixed(2)}</span></div>}
                    </div>
                  )}
                  
                  {/* Discount */}
                  {feePreview.discountAmount > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Discount ({deliveryForm.manualDiscountPercent || 0}%)</span>
                      <span className="font-medium text-red-600">- ₹{feePreview.discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Final Fee */}
                  <div className="flex justify-between items-center py-3 text-lg font-bold bg-gray-50 px-3 rounded-lg mt-4">
                    <span>Final Delivery Fee:</span>
                    <span className="text-green-600 text-2xl">₹{feePreview.finalFee.toFixed(2)}</span>
                  </div>
                  
                  {/* Profit Calculation */}
                  <div className="pt-4 mt-4 border-t-2 border-dashed">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Profit Projection</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Final Fee</span>
                        <span className="font-medium">₹{feePreview.finalFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Fixed Costs (Fuel, Staff, etc.)</span>
                        <span className="font-medium text-red-600">- ₹{feePreview.totalCosts.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 text-lg font-bold bg-blue-50 px-3 rounded-lg mt-2">
                        <span>Projected Profit:</span>
                        <span className="text-blue-600 text-xl">₹{feePreview.profit.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer List */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Users className="h-6 w-6 mr-3 text-indigo-600" />
                  Customer Database ({Object.keys(customers).length} customers)
                </h2>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {Object.values(customers).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No customers yet. Process your first delivery to see customers here.</p>
                    </div>
                  ) : (
                    Object.values(customers).map((customer, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 flex items-center">
                              <Star className="h-4 w-4 mr-2 text-yellow-500" />
                              {customer.name}
                            </h3>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <p className="flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                {customer.phone}
                              </p>
                              <p className="flex items-start">
                                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="break-words">{customer.address}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">₹{customer.totalSpent.toFixed(2)}</div>
                            <div className="text-sm text-gray-500">{customer.orderCount} orders</div>
                            <div className="text-xs text-gray-400">Last: {new Date(customer.lastOrderDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Top Customers */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Top Customers</h3>
                <div className="space-y-3">
                  {topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="truncate pr-2">
                        <div className="font-medium text-gray-800 truncate">{customer.name}</div>
                        <div className="text-sm text-gray-600">{customer.orderCount} orders</div>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <div className="font-bold text-green-600">₹{customer.totalSpent.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                  {topCustomers.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No customers yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Financial Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="text-xl md:text-2xl font-bold text-green-600">₹{currentMonthData.totalRevenue.toFixed(2)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Profit</p>
                      <p className="text-xl md:text-2xl font-bold text-blue-600">₹{currentMonthData.totalProfit.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Deliveries</p>
                      <p className="text-xl md:text-2xl font-bold text-purple-600">{currentMonthData.totalDeliveries}</p>
                    </div>
                    <Package className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Net Income</p>
                      <p className="text-xl md:text-2xl font-bold text-indigo-600">₹{currentMonthData.netIncome.toFixed(2)}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-indigo-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Breakdown */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Financial Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-medium text-green-600">₹{currentMonthData.totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Total Discounts Given</span>
                      <span className="font-medium text-red-600">-₹{currentMonthData.totalDiscounts.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Total Surcharges</span>
                      <span className="font-medium text-amber-600">+₹{currentMonthData.totalSurcharges.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Other Expenses</span>
                      <span className="font-medium text-red-600">-₹{currentMonthData.expenses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 text-lg font-bold bg-indigo-50 px-3 rounded-lg">
                      <span>Net Income</span>
                      <span className="text-indigo-600">₹{currentMonthData.netIncome.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Add Expense */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Add Business Expense</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                      <input
                        type="text"
                        value={expenseForm.description}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Fuel, Maintenance, Marketing"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹) *</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter amount"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={expenseForm.category}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="fuel">Fuel</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="marketing">Marketing</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <button
                      onClick={addExpense}
                      className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      Add Expense
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Deliveries */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Deliveries</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Customer</th>
                        <th className="text-left py-3 px-2">Distance</th>
                        <th className="text-left py-3 px-2">Fee</th>
                        <th className="text-left py-3 px-2">Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDeliveries.map((delivery) => (
                        <tr key={delivery.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2 whitespace-nowrap">{new Date(delivery.date).toLocaleDateString()}</td>
                          <td className="py-3 px-2 max-w-[150px] truncate">{delivery.customerName}</td>
                          <td className="py-3 px-2">{delivery.distanceKm} km</td>
                          <td className="py-3 px-2 font-medium text-green-600">₹{delivery.finalFee.toFixed(2)}</td>
                          <td className="py-3 px-2 font-medium text-blue-600">₹{delivery.profit.toFixed(2)}</td>
                        </tr>
                      ))}
                      {recentDeliveries.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-500">
                            No deliveries yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FileSpreadsheet className="h-6 w-6 mr-3 text-indigo-600" />
                Data Export & Management
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Export Options</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => exportToExcel(deliveries, customers, monthlyData)}
                      className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <Download className="h-5 w-5" />
                      <span>Export All Data to Excel</span>
                    </button>
                    <p className="text-sm text-gray-600">
                      Exports all deliveries, customers, profit analysis, and monthly summaries to a multi-sheet Excel file.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Month Management</h3>
                  <div className="space-y-3">
                    <button
                      onClick={startNewMonth}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Start New Month</span>
                    </button>
                    <p className="text-sm text-gray-600">
                      Creates a new monthly tracking period. Current cash will carry forward.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">System Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xl font-bold text-gray-800">{deliveries.length}</div>
                    <div className="text-sm text-gray-600">Total Deliveries</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xl font-bold text-gray-800">{Object.keys(customers).length}</div>
                    <div className="text-sm text-gray-600">Total Customers</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xl font-bold text-gray-800">₹{deliveries.reduce((sum, d) => sum + d.finalFee, 0).toFixed(2)}</div>
                    <div className="text-sm text-gray-600">All-Time Revenue</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xl font-bold text-gray-800">₹{deliveries.reduce((sum, d) => sum + d.profit, 0).toFixed(2)}</div>
                    <div className="text-sm text-gray-600">All-Time Profit</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryManagementSystem;
