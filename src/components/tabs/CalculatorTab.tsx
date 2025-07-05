
import React, { useState } from 'react';
import { DeliveryForm as DeliveryFormType } from '../../types/delivery';
import { FeeCalculation } from '../../utils/deliveryCalculations';
import DeliveryForm from '../DeliveryForm';
import FeePreview from '../FeePreview';
import DeliveryTimer from '../DeliveryTimer';
import AutoDistanceTracker from '../AutoDistanceTracker';

interface CalculatorTabProps {
  deliveryForm: DeliveryFormType;
  setDeliveryForm: (form: DeliveryFormType) => void;
  onProcessDelivery: () => void;
  feePreview: FeeCalculation;
}

const CalculatorTab: React.FC<CalculatorTabProps> = ({
  deliveryForm,
  setDeliveryForm,
  onProcessDelivery,
  feePreview
}) => {
  const [timerData, setTimerData] = useState<{
    startTime: string | null;
    endTime: string | null;
    duration: number;
  }>({ startTime: null, endTime: null, duration: 0 });
  
  const [autoDistance, setAutoDistance] = useState<number | null>(null);
  const [locationData, setLocationData] = useState<{
    pickup: { latitude: number; longitude: number; timestamp: number } | null;
    delivery: { latitude: number; longitude: number; timestamp: number } | null;
  }>({ pickup: null, delivery: null });

  const isDeliveryActive = !!(
    deliveryForm.customerName && 
    deliveryForm.customerPhone && 
    deliveryForm.customerAddress && 
    deliveryForm.distanceMeters
  );

  const handleTimerUpdate = (startTime: string | null, endTime: string | null, durationMinutes: number) => {
    setTimerData({ startTime, endTime, duration: durationMinutes });
  };

  const handleDistanceCalculated = (
    distance: number, 
    pickupCoords: { latitude: number; longitude: number; timestamp: number }, 
    deliveryCoords: { latitude: number; longitude: number; timestamp: number }
  ) => {
    setAutoDistance(distance);
    setLocationData({ pickup: pickupCoords, delivery: deliveryCoords });
    
    // Auto-update the distance in the form if it's significantly different
    const currentDistance = parseInt(deliveryForm.distanceMeters) || 0;
    if (Math.abs(distance - currentDistance) > 100) {
      setDeliveryForm(prev => ({ ...prev, distanceMeters: distance.toString() }));
    }
  };

  const handleProcessDelivery = () => {
    // Store timer and location data in form before processing
    const enhancedForm = {
      ...deliveryForm,
      // Add timer data
      startTime: timerData.startTime,
      endTime: timerData.endTime,
      durationMinutes: timerData.duration,
      // Add location data
      pickupLatitude: locationData.pickup?.latitude,
      pickupLongitude: locationData.pickup?.longitude,
      deliveryLatitude: locationData.delivery?.latitude,
      deliveryLongitude: locationData.delivery?.longitude,
      // Add auto distance
      autoDistanceMeters: autoDistance,
      distanceSource: autoDistance ? 'auto' : 'manual'
    };
    
    console.log('Enhanced delivery form with tracking data:', enhancedForm);
    
    // Update the form with enhanced data before processing
    setDeliveryForm(enhancedForm);
    onProcessDelivery();
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Left Column: Delivery Form */}
        <div className="space-y-4">
          <DeliveryForm
            deliveryForm={deliveryForm}
            setDeliveryForm={setDeliveryForm}
            onProcessDelivery={handleProcessDelivery}
          />
        </div>

        {/* Right Column: Fee Preview */}
        <div className="space-y-4">
          <FeePreview
            feePreview={feePreview}
            deliveryForm={deliveryForm}
            autoDistance={autoDistance || undefined}
            timerDuration={timerData.duration || undefined}
          />
        </div>
      </div>

      {/* Bottom Row: Timer and Distance Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <DeliveryTimer
          onTimeUpdate={handleTimerUpdate}
          isDeliveryActive={isDeliveryActive}
        />
        
        <AutoDistanceTracker
          onDistanceCalculated={handleDistanceCalculated}
          isDeliveryActive={isDeliveryActive}
        />
      </div>

      {/* Enhanced Status Summary */}
      {isDeliveryActive && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-3 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
            Delivery Status - Live Tracking
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center justify-between p-2 bg-white/50 rounded">
              <span className="text-blue-600 font-medium">Timer:</span>
              <span className={`font-semibold ${timerData.startTime ? 'text-green-600' : 'text-gray-400'}`}>
                {timerData.startTime ? 'Running' : 'Ready'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/50 rounded">
              <span className="text-blue-600 font-medium">Auto Distance:</span>
              <span className={`font-semibold ${autoDistance ? 'text-green-600' : 'text-gray-400'}`}>
                {autoDistance ? `${autoDistance.toLocaleString()}m` : 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/50 rounded">
              <span className="text-blue-600 font-medium">Vendor:</span>
              <span className={`font-semibold ${deliveryForm.vendorId && deliveryForm.vendorId !== 'none' ? 'text-green-600' : 'text-gray-400'}`}>
                {deliveryForm.vendorId && deliveryForm.vendorId !== 'none' ? 'Selected' : 'None'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/50 rounded">
              <span className="text-blue-600 font-medium">Duration:</span>
              <span className={`font-semibold ${timerData.duration > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                {timerData.duration > 0 ? `${timerData.duration}min` : 'Pending'}
              </span>
            </div>
          </div>
          
          {/* Distance Comparison */}
          {autoDistance && deliveryForm.distanceMeters && (
            <div className="mt-3 p-2 bg-white/50 rounded">
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium">Distance Accuracy:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Manual: {parseInt(deliveryForm.distanceMeters).toLocaleString()}m</span>
                  <span className="text-gray-400">vs</span>
                  <span className="text-sm">Auto: {autoDistance.toLocaleString()}m</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    Math.abs(autoDistance - parseInt(deliveryForm.distanceMeters)) < 100 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {Math.abs(autoDistance - parseInt(deliveryForm.distanceMeters)) < 100 ? 'Accurate' : 'Review Needed'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculatorTab;
