
import React from 'react';
import { FileSpreadsheet, Download, Calendar } from 'lucide-react';
import { Delivery, CustomerMap, MonthlyData } from '../types/delivery';
import { exportToExcel } from '../utils/excelExport';

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
            <p className="text-xs sm:text-sm text-gray-600">
              Creates a new monthly tracking period. Current cash will carry forward.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">System Summary</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
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
        </div>
      </div>
    </div>
  );
};

export default DataExport;
