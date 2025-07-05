
import React, { useState } from 'react';
import { Navigation, AlertCircle, CheckCircle } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateDistance } from '../utils/distanceCalculations';
import { LocationStatus } from './distance-tracker/LocationStatus';
import { TrackingControls } from './distance-tracker/TrackingControls';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface AutoDistanceTrackerProps {
  onDistanceCalculated?: (distance: number, pickupCoords: Location, deliveryCoords: Location) => void;
  isDeliveryActive: boolean;
}

const AutoDistanceTracker: React.FC<AutoDistanceTrackerProps> = ({
  onDistanceCalculated,
  isDeliveryActive
}) => {
  const [isTracking, setIsTracking] = useState(false);
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { permissionStatus, getCurrentLocation } = useGeolocation();

  const handleStartTracking = async () => {
    setError(null);
    setIsTracking(true);
    
    try {
      const location = await getCurrentLocation();
      setPickupLocation(location);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start tracking');
      setIsTracking(false);
    }
  };

  const handleEndTracking = async () => {
    if (!pickupLocation) {
      setError('No pickup location recorded');
      return;
    }

    try {
      const location = await getCurrentLocation();
      setDeliveryLocation(location);

      const distance = calculateDistance(
        pickupLocation.latitude,
        pickupLocation.longitude,
        location.latitude,
        location.longitude
      );

      setCalculatedDistance(distance);
      setIsTracking(false);
      
      onDistanceCalculated?.(distance, pickupLocation, location);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end tracking');
    }
  };

  const handleReset = () => {
    setPickupLocation(null);
    setDeliveryLocation(null);
    setCalculatedDistance(null);
    setError(null);
    setIsTracking(false);
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Navigation className="h-5 w-5 mr-2 text-green-600" />
          Auto Distance Tracker
        </h3>
        {calculatedDistance && (
          <CheckCircle className="h-5 w-5 text-green-500" />
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      <LocationStatus
        pickupLocation={pickupLocation}
        deliveryLocation={deliveryLocation}
        calculatedDistance={calculatedDistance}
      />

      <TrackingControls
        isTracking={isTracking}
        pickupLocation={pickupLocation}
        deliveryLocation={deliveryLocation}
        isDeliveryActive={isDeliveryActive}
        permissionStatus={permissionStatus}
        onStartTracking={handleStartTracking}
        onEndTracking={handleEndTracking}
        onReset={handleReset}
      />

      {permissionStatus === 'denied' && (
        <p className="text-xs text-red-500 text-center mt-2">
          Location access denied. Please enable location services.
        </p>
      )}

      {!isDeliveryActive && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Fill delivery details to enable tracking
        </p>
      )}
    </div>
  );
};

export default AutoDistanceTracker;
