
import React from 'react';
import { Calculator, CloudDrizzle, Clock, Zap, Package } from 'lucide-react';
import { DeliveryForm as DeliveryFormType } from '../types/delivery';
import { BASE_WEIGHT_KG, BAD_WEATHER_SURCHARGE, OFF_HOUR_SURCHARGE, FAST_DELIVERY_BONUS } from '../utils/deliveryCalculations';

interface DeliveryFormProps {
  deliveryForm: DeliveryFormType;
  setDeliveryForm: React.Dispatch<React.SetStateAction<DeliveryFormType>>;
  onProcessDelivery: () => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({
  deliveryForm,
  setDeliveryForm,
  onProcessDelivery
}) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
        <Calculator className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-indigo-600" />
        <span className="text-sm sm:text-base">New Delivery Order</span>
      </h2>
      
      <div className="space-y-4">
        {/* Customer Info - Mobile Stacked */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
            <input 
              type="text" 
              value={deliveryForm.customerName} 
              onChange={(e) => setDeliveryForm(prev => ({ ...prev, customerName: e.target.value }))} 
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
                onChange={(e) => setDeliveryForm(prev => ({ ...prev, customerPhone: e.target.value }))} 
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
                onChange={(e) => setDeliveryForm(prev => ({ ...prev, distanceMeters: e.target.value }))} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base" 
                placeholder="e.g., 2500" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Address *</label>
            <textarea 
              value={deliveryForm.customerAddress} 
              onChange={(e) => setDeliveryForm(prev => ({ ...prev, customerAddress: e.target.value }))} 
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
              onChange={(e) => setDeliveryForm(prev => ({ ...prev, orderDescription: e.target.value }))} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base" 
              placeholder="e.g., Food delivery, Package, etc." 
            />
          </div>
        </div>
        
        {/* Order Details - Mobile Optimized Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
            <input 
              type="number" 
              min="0"
              step="0.1"
              inputMode="decimal"
              value={deliveryForm.weightKg} 
              onChange={(e) => setDeliveryForm(prev => ({ ...prev, weightKg: e.target.value }))} 
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
              onChange={(e) => setDeliveryForm(prev => ({ ...prev, manualDiscountPercent: e.target.value }))} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base" 
              placeholder="e.g., 10" 
            />
          </div>
        </div>

        {/* Mobile-Optimized Surcharge Toggles */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-medium text-gray-700">Additional Charges & Conditions</h3>
          <div className="space-y-2">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input 
                type="checkbox" 
                checked={deliveryForm.isBadWeather} 
                onChange={(e) => setDeliveryForm(prev => ({ ...prev, isBadWeather: e.target.checked }))} 
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
                onChange={(e) => setDeliveryForm(prev => ({ ...prev, isOffHour: e.target.checked }))} 
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
                onChange={(e) => setDeliveryForm(prev => ({ ...prev, isFastDelivery: e.target.checked }))} 
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded mr-3" 
              />
              <Zap className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-sm text-gray-600 flex-1">Express Delivery</span>
              <span className="text-sm font-medium text-amber-600">+₹{FAST_DELIVERY_BONUS}</span>
            </label>
          </div>
        </div>

        {/* Mobile-Optimized Submit Button */}
        <div className="pt-4">
          <button 
            onClick={onProcessDelivery} 
            className="w-full bg-indigo-600 text-white py-4 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 shadow-sm text-base touch-manipulation"
          >
            <Package className="h-5 w-5" />
            <span>Process Delivery & Calculate Fee</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryForm;
