
import React from 'react';
import { Package, Download, Menu } from 'lucide-react';
import { exportToExcel } from '../utils/excelExport';
import { Delivery, CustomerMap, MonthlyData } from '../types/delivery';

interface AppHeaderProps {
  currentMonth: string;
  cashOnHand: number;
  deliveries: Delivery[];
  customers: CustomerMap;
  monthlyData: { [key: string]: MonthlyData };
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  currentMonth,
  cashOnHand,
  deliveries,
  customers,
  monthlyData,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col space-y-4">
        {/* Top Row: Logo and Menu */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800">Dynamic Delivery</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Stats Row - Mobile Optimized */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:block`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-600">Current Month</p>
              <p className="text-sm sm:text-lg font-semibold text-gray-800">{currentMonth}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-600">Cash on Hand</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">₹{cashOnHand.toFixed(2)}</p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <button
                onClick={() => exportToExcel(deliveries, customers, monthlyData)}
                className="flex items-center space-x-1 sm:space-x-2 bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm text-sm"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export Excel</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
