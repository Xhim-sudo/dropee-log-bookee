
import React from 'react';
import { DeliveryForm } from '../../types/delivery';
import { BASE_WEIGHT_KG } from '../../utils/deliveryCalculations';
import { EssentialModeToggle } from './EssentialModeToggle';

interface OrderDetailsFieldsProps {
  deliveryForm: DeliveryForm;
  onFormChange: (updates: Partial<DeliveryForm>) => void;
}

export const OrderDetailsFields: React.FC<OrderDetailsFieldsProps> = ({
  deliveryForm,
  onFormChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
          <input 
            type="number" 
            min="0"
            step="0.1"
            inputMode="decimal"
            value={deliveryForm.weightKg} 
            onChange={(e) => onFormChange({ weightKg: e.target.value })} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base" 
            placeholder={`Base: ${BASE_WEIGHT_KG}kg`} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
          <input 
            type="number" 
            min="0"
            max="100"
            inputMode="numeric"
            value={deliveryForm.manualDiscountPercent} 
            onChange={(e) => onFormChange({ manualDiscountPercent: e.target.value })} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base" 
            placeholder="e.g., 10" 
          />
        </div>
      </div>
      
      <EssentialModeToggle
        deliveryForm={deliveryForm}
        onFormChange={onFormChange}
      />
    </div>
  );
};
