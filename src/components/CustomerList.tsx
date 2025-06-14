
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
  );
};

export default CustomerList;
