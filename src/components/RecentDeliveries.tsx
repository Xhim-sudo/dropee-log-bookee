
import React from 'react';
import { Delivery } from '../types/delivery';

interface RecentDeliveriesProps {
  deliveries: Delivery[];
}

const RecentDeliveries: React.FC<RecentDeliveriesProps> = ({ deliveries }) => {
  const recentDeliveries = [...deliveries].reverse().slice(0, 10);

  return (
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
  );
};

export default RecentDeliveries;
