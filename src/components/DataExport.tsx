
import React from 'react';
import { FileSpreadsheet, Download, Calendar, Trash2, AlertTriangle } from 'lucide-react';
import { Delivery, CustomerMap, MonthlyData } from '../types/delivery';
import { exportToExcel } from '../utils/excelExport';
import { useDataOperations } from '../hooks/useDataOperations';

interface DataExportProps {
  deliveries: Delivery[];
  customers: CustomerMap;
  monthlyData: { [key: string]: MonthlyData };
  onStartNewMonth: () => void;
}

const DataExport: React.FC<DataExportProps> = ({
  deliveries,
  customers,
  monthlyData,
  onStartNewMonth
}) => {
  const { clearAllData, isClearing } = useDataOperations();

  // Calculate fixed costs across all deliveries
  const totalFixedCosts = deliveries.reduce((total, delivery) => {
    const fuelCost = delivery.distanceMeters * 0.002; // ₹2 per km
    const maintenanceCost = delivery.distanceMeters * 0.001; // ₹1 per km
    return total + fuelCost + maintenanceCost;
  }, 0);

  const handleClearAllData = () => {
    if (window.confirm('⚠️ WARNING: This will permanently delete ALL data including customers, deliveries, expenses, and monthly summaries. This action cannot be undone. Are you absolutely sure?')) {
      if (window.confirm('This is your final confirmation. All data will be permanently lost. Continue?')) {
        clearAllData();
      }
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
        <FileSpreadsheet className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-indigo-600" />
        Data Export & Management
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Export Options</h3>
          <div className="space-y-3">
            <button
              onClick={() => exportToExcel(deliveries, customers, monthlyData)}
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-base touch-manipulation"
            >
              <Download className="h-5 w-5" />
              <span>Export All Data to Excel</span>
            </button>
            <p className="text-xs sm:text-sm text-gray-600">
              Exports all deliveries, customers, profit analysis, and monthly summaries to a multi-sheet Excel file.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Month Management</h3>
          <div className="space-y-3">
            <button
              onClick={onStartNewMonth}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-base touch-manipulation"
            >
              <Calendar className="h-5 w-5" />
              <span>Start New Month</span>
            </button>
            <button
              onClick={handleClearAllData}
              disabled={isClearing}
              className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors text-base touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isClearing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Clearing...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-5 w-5" />
                  <span>Clear All Data</span>
                </>
              )}
            </button>
            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              <p>Creates a new monthly tracking period. Current cash will carry forward.</p>
              <div className="flex items-start space-x-2 p-2 bg-red-50 rounded border-l-4 border-red-400">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700">
                  <strong>Clear All Data:</strong> Permanently deletes everything for a fresh June start. Cannot be undone!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">System Summary</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 text-center">
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div className="text-lg sm:text-xl font-bold text-gray-800">{deliveries.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Deliveries</div>
          </div>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div className="text-lg sm:text-xl font-bold text-gray-800">{Object.keys(customers).length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Customers</div>
          </div>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div className="text-lg sm:text-xl font-bold text-gray-800">₹{deliveries.reduce((sum, d) => sum + d.finalFee, 0).toFixed(2)}</div>
            <div className="text-xs sm:text-sm text-gray-600">All-Time Revenue</div>
          </div>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div className="text-lg sm:text-xl font-bold text-gray-800">₹{deliveries.reduce((sum, d) => sum + d.profit, 0).toFixed(2)}</div>
            <div className="text-xs sm:text-sm text-gray-600">All-Time Profit</div>
          </div>
          <div className="bg-orange-50 p-3 sm:p-4 rounded-lg border border-orange-200">
            <div className="text-lg sm:text-xl font-bold text-orange-800">₹{totalFixedCosts.toFixed(2)}</div>
            <div className="text-xs sm:text-sm text-orange-600">Fixed Costs</div>
            <div className="text-xs text-orange-500">(Fuel + Maintenance)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExport;
