
import React from 'react';
import { DollarSign, TrendingUp, Package, Calendar } from 'lucide-react';
import { MonthlyData, ExpenseForm } from '../types/delivery';

interface FinancialOverviewProps {
  currentMonthData: MonthlyData;
  expenseForm: ExpenseForm;
  setExpenseForm: React.Dispatch<React.SetStateAction<ExpenseForm>>;
  onAddExpense: () => void;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  currentMonthData,
  expenseForm,
  setExpenseForm,
  onAddExpense
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-Optimized Financial Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="text-xs sm:text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-sm sm:text-xl md:text-2xl font-bold text-green-600">₹{currentMonthData.totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 self-end sm:self-auto" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="text-xs sm:text-sm text-gray-600">Monthly Profit</p>
              <p className="text-sm sm:text-xl md:text-2xl font-bold text-blue-600">₹{currentMonthData.totalProfit.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 self-end sm:self-auto" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="text-xs sm:text-sm text-gray-600">Total Deliveries</p>
              <p className="text-sm sm:text-xl md:text-2xl font-bold text-purple-600">{currentMonthData.totalDeliveries}</p>
            </div>
            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 self-end sm:self-auto" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="text-xs sm:text-sm text-gray-600">Net Income</p>
              <p className="text-sm sm:text-xl md:text-2xl font-bold text-indigo-600">₹{currentMonthData.netIncome.toFixed(2)}</p>
            </div>
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-500 self-end sm:self-auto" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Monthly Breakdown */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Monthly Financial Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm sm:text-base text-gray-600">Total Revenue</span>
              <span className="font-medium text-green-600 text-sm sm:text-base">₹{currentMonthData.totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm sm:text-base text-gray-600">Total Discounts Given</span>
              <span className="font-medium text-red-600 text-sm sm:text-base">-₹{currentMonthData.totalDiscounts.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm sm:text-base text-gray-600">Total Surcharges</span>
              <span className="font-medium text-amber-600 text-sm sm:text-base">+₹{currentMonthData.totalSurcharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm sm:text-base text-gray-600">Other Expenses</span>
              <span className="font-medium text-red-600 text-sm sm:text-base">-₹{currentMonthData.expenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 text-base sm:text-lg font-bold bg-indigo-50 px-3 rounded-lg">
              <span>Net Income</span>
              <span className="text-indigo-600">₹{currentMonthData.netIncome.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Add Expense */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Add Business Expense</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <input
                type="text"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                placeholder="e.g., Fuel, Maintenance, Marketing"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹) *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
              >
                <option value="fuel">Fuel</option>
                <option value="maintenance">Maintenance</option>
                <option value="marketing">Marketing</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              onClick={onAddExpense}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors text-base touch-manipulation"
            >
              Add Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;
