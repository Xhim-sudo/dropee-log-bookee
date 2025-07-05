
import React from 'react';
import { DeliveryForm } from '../../types/delivery';

interface CustomerInfoFieldsProps {
  deliveryForm: DeliveryForm;
  onFormChange: (updates: Partial<DeliveryForm>) => void;
}

export const CustomerInfoFields: React.FC<CustomerInfoFieldsProps> = ({
  deliveryForm,
  onFormChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
        <input 
          type="text" 
          value={deliveryForm.customerName} 
          onChange={(e) => onFormChange({ customerName: e.target.value })} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base" 
          placeholder="Enter customer name" 
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input 
            type="tel" 
            value={deliveryForm.customerPhone} 
            onChange={(e) => onFormChange({ customerPhone: e.target.value })} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base" 
            placeholder="Enter phone number" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Distance (Meters) *</label>
          <input 
            type="number" 
            min="0"
            inputMode="numeric"
            value={deliveryForm.distanceMeters} 
            onChange={(e) => onFormChange({ distanceMeters: e.target.value })} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base" 
            placeholder="e.g., 2500" 
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Customer Address *</label>
        <textarea 
          value={deliveryForm.customerAddress} 
          onChange={(e) => onFormChange({ customerAddress: e.target.value })} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none text-base" 
          placeholder="Enter full delivery address" 
          rows={2}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Order Description</label>
        <input 
          type="text" 
          value={deliveryForm.orderDescription} 
          onChange={(e) => onFormChange({ orderDescription: e.target.value })} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base" 
          placeholder="e.g., Food delivery, Package, etc." 
        />
      </div>
    </div>
  );
};
