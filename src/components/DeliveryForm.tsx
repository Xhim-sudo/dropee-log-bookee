
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
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Calculator className="h-6 w-6 mr-3 text-indigo-600" />
        New Delivery Order
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Info */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
          <input 
            type="text" 
            value={deliveryForm.customerName} 
            onChange={(e) => setDeliveryForm(prev => ({ ...prev, customerName: e.target.value }))} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
            placeholder="Enter customer name" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input 
            type="tel" 
            value={deliveryForm.customerPhone} 
            onChange={(e) => setDeliveryForm(prev => ({ ...prev, customerPhone: e.target.value }))} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
            placeholder="Enter phone number" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Distance (Meters) *</label>
          <input 
            type="number" 
            min="0"
            value={deliveryForm.distanceMeters} 
            onChange={(e) => setDeliveryForm(prev => ({ ...prev, distanceMeters: e.target.value }))} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
            placeholder="e.g., 2500" 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Address *</label>
          <textarea 
            value={deliveryForm.customerAddress} 
            onChange={(e) => setDeliveryForm(prev => ({ ...prev, customerAddress: e.target.value }))} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none" 
            placeholder="Enter full delivery address" 
            rows={2}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Order Description</label>
          <input 
            type="text" 
            value={deliveryForm.orderDescription} 
            onChange={(e) => setDeliveryForm(prev => ({ ...prev, orderDescription: e.target.value }))} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
            placeholder="e.g., Food delivery, Package, etc." 
          />
        </div>
        
        {/* Order Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
          <input 
            type="number" 
            min="0"
            step="0.1"
            value={deliveryForm.weightKg} 
            onChange={(e) => setDeliveryForm(prev => ({ ...prev, weightKg: e.target.value }))} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
            placeholder={`Base: ${BASE_WEIGHT_KG}kg`} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
          <input 
            type="number" 
            min="0"
            max="100"
            value={deliveryForm.manualDiscountPercent} 
            onChange={(e) => setDeliveryForm(prev => ({ ...prev, manualDiscountPercent: e.target.value }))} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
            placeholder="e.g., 10" 
          />
        </div>

        {/* Surcharge Toggles */}
        <div className="md:col-span-2 space-y-3 pt-2">
          <h3 className="text-sm font-medium text-gray-700">Additional Charges & Conditions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input 
                type="checkbox" 
                checked={deliveryForm.isBadWeather} 
                onChange={(e) => setDeliveryForm(prev => ({ ...prev, isBadWeather: e.target.checked }))} 
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded" 
              />
              <CloudDrizzle className="h-4 w-4 ml-2 mr-1 text-gray-500" />
              <span className="text-sm text-gray-600">Bad Weather (+₹{BAD_WEATHER_SURCHARGE})</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input 
                type="checkbox" 
                checked={deliveryForm.isOffHour} 
                onChange={(e) => setDeliveryForm(prev => ({ ...prev, isOffHour: e.target.checked }))} 
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded" 
              />
              <Clock className="h-4 w-4 ml-2 mr-1 text-gray-500" />
              <span className="text-sm text-gray-600">Off-Hour (+₹{OFF_HOUR_SURCHARGE})</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input 
                type="checkbox" 
                checked={deliveryForm.isFastDelivery} 
                onChange={(e) => setDeliveryForm(prev => ({ ...prev, isFastDelivery: e.target.checked }))} 
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded" 
              />
              <Zap className="h-4 w-4 ml-2 mr-1 text-gray-500" />
              <span className="text-sm text-gray-600">Express (+₹{FAST_DELIVERY_BONUS})</span>
            </label>
          </div>
        </div>

        <div className="md:col-span-2 pt-2">
          <button 
            onClick={onProcessDelivery} 
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 shadow-sm"
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
