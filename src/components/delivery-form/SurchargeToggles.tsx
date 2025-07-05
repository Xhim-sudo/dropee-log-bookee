
import React from 'react';
import { CloudDrizzle, Clock, Zap } from 'lucide-react';
import { DeliveryForm } from '../../types/delivery';
import { BAD_WEATHER_SURCHARGE, OFF_HOUR_SURCHARGE, FAST_DELIVERY_BONUS } from '../../utils/deliveryCalculations';

interface SurchargeTogglesProps {
  deliveryForm: DeliveryForm;
  onFormChange: (updates: Partial<DeliveryForm>) => void;
}

export const SurchargeToggles: React.FC<SurchargeTogglesProps> = ({
  deliveryForm,
  onFormChange
}) => {
  return (
    <div className="space-y-3 pt-2">
      <h3 className="text-sm font-medium text-gray-700">Additional Charges & Conditions</h3>
      <div className="space-y-2">
        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input 
            type="checkbox" 
            checked={deliveryForm.isBadWeather} 
            onChange={(e) => onFormChange({ isBadWeather: e.target.checked })} 
            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded mr-3" 
          />
          <CloudDrizzle className="h-5 w-5 mr-2 text-gray-500" />
          <span className="text-sm text-gray-600 flex-1">Bad Weather</span>
          <span className="text-sm font-medium text-amber-600">+₹{BAD_WEATHER_SURCHARGE}</span>
        </label>
        
        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input 
            type="checkbox" 
            checked={deliveryForm.isOffHour} 
            onChange={(e) => onFormChange({ isOffHour: e.target.checked })} 
            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded mr-3" 
          />
          <Clock className="h-5 w-5 mr-2 text-gray-500" />
          <span className="text-sm text-gray-600 flex-1">Off-Hour Delivery</span>
          <span className="text-sm font-medium text-amber-600">+₹{OFF_HOUR_SURCHARGE}</span>
        </label>
        
        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input 
            type="checkbox" 
            checked={deliveryForm.isFastDelivery} 
            onChange={(e) => onFormChange({ isFastDelivery: e.target.checked })} 
            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded mr-3" 
          />
          <Zap className="h-5 w-5 mr-2 text-gray-500" />
          <span className="text-sm text-gray-600 flex-1">Express Delivery</span>
          <span className="text-sm font-medium text-amber-600">+₹{FAST_DELIVERY_BONUS}</span>
        </label>
      </div>
    </div>
  );
};
