
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

      {/* Status Summary */}
      {isDeliveryActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Delivery Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600">Timer: </span>
              <span className={timerData.startTime ? 'text-green-600' : 'text-gray-400'}>
                {timerData.startTime ? 'Active' : 'Ready'}
              </span>
            </div>
            <div>
              <span className="text-blue-600">Auto Distance: </span>
              <span className={autoDistance ? 'text-green-600' : 'text-gray-400'}>
                {autoDistance ? `${autoDistance}m` : 'Not set'}
              </span>
            </div>
            <div>
              <span className="text-blue-600">Vendor: </span>
              <span className={deliveryForm.vendorId ? 'text-green-600' : 'text-gray-400'}>
                {deliveryForm.vendorId ? 'Selected' : 'None'}
              </span>
            </div>
            <div>
              <span className="text-blue-600">Duration: </span>
              <span className={timerData.duration > 0 ? 'text-green-600' : 'text-gray-400'}>
                {timerData.duration > 0 ? `${timerData.duration}min` : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorTab;
