
import React from 'react';
import { Delivery } from '../types/delivery';

interface RecentDeliveriesProps {
  deliveries: Delivery[];
}

const RecentDeliveries: React.FC<RecentDeliveriesProps> = ({ deliveries }) => {
  const recentDeliveries = [...deliveries].reverse().slice(0, 10);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Recent Deliveries</h3>
      
      {/* Mobile-First Table */}
      <div className="overflow-x-auto">
        <div className="hidden sm:block">
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
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="sm:hidden space-y-3">
          {recentDeliveries.map((delivery) => (
            <div key={delivery.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">{delivery.customerName}</h4>
                  <p className="text-xs text-gray-500">{new Date(delivery.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right ml-2">
                  <div className="text-sm font-medium text-green-600">₹{delivery.finalFee.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{delivery.distanceKm} km</div>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Profit:</span>
                <span className="font-medium text-blue-600">₹{delivery.profit.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {recentDeliveries.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No deliveries yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentDeliveries;
