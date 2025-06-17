
import React from 'react';
import { Users, Phone, MapPin, Star } from 'lucide-react';
import { CustomerMap } from '../types/delivery';

interface CustomerListProps {
  customers: CustomerMap;
}

const CustomerList: React.FC<CustomerListProps> = ({ customers }) => {
  const topCustomers = Object.values(customers)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  return (
    <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
      {/* Customer List */}
      <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
          <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-indigo-600" />
          <span>Customer Database ({Object.keys(customers).length} customers)</span>
        </h2>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {Object.values(customers).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm sm:text-base">No customers yet. Process your first delivery to see customers here.</p>
            </div>
          ) : (
            Object.values(customers).map((customer, index) => (
              <div key={index} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 flex items-center text-sm sm:text-base">
                        <Star className="h-4 w-4 mr-2 text-yellow-500 flex-shrink-0" />
                        <span className="truncate">{customer.name}</span>
                      </h3>
                    </div>
                    <div className="text-right ml-3">
                      <div className="text-base sm:text-lg font-bold text-green-600">₹{customer.totalSpent.toFixed(2)}</div>
                      <div className="text-xs sm:text-sm text-gray-500">{customer.orderCount} orders</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="break-all">{customer.phone}</span>
                    </p>
                    <p className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="break-words">{customer.address}</span>
                    </p>
                    <p className="text-xs text-gray-400">Last order: {new Date(customer.lastOrderDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Top Customers</h3>
        <div className="space-y-3">
          {topCustomers.map((customer, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0 pr-3">
                <div className="font-medium text-gray-800 truncate text-sm sm:text-base">{customer.name}</div>
                <div className="text-xs sm:text-sm text-gray-600">{customer.orderCount} orders</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600 text-sm sm:text-base">₹{customer.totalSpent.toFixed(2)}</div>
              </div>
            </div>
          ))}
          {topCustomers.length === 0 && (
            <p className="text-gray-500 text-center py-4 text-sm sm:text-base">No customers yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
