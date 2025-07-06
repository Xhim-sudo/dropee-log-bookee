
import React from 'react';
import { DeliveryForm } from '../../types/delivery';

interface EssentialModeToggleProps {
  deliveryForm: DeliveryForm;
  onFormChange: (updates: Partial<DeliveryForm>) => void;
}

export const EssentialModeToggle: React.FC<EssentialModeToggleProps> = ({
  deliveryForm,
  onFormChange
}) => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-green-800 mb-1 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Essential Mode
          </h4>
          <p className="text-sm text-green-600">
            20% discount for essential deliveries (medicine, groceries, emergency items)
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer ml-4">
          <input
            type="checkbox"
            checked={deliveryForm.isEssentialMode || false}
            onChange={(e) => onFormChange({ isEssentialMode: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>
      
      {deliveryForm.isEssentialMode && (
        <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-700">
          ✓ Essential mode activated - 20% discount will be applied to distance fee
        </div>
      )}
    </div>
  );
};
