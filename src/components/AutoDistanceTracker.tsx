
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

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
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');

  useEffect(() => {
    // Check geolocation permission on mount
    if ('geolocation' in navigator) {
      navigator.permissions?.query({ name: 'geolocation' })
        .then(result => {
          setPermissionStatus(result.state as 'granted' | 'denied');
        })
        .catch(() => {
          setPermissionStatus('unknown');
        });
    }
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now()
          });
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied';
              setPermissionStatus('denied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timeout';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const handleStartTracking = async () => {
    setError(null);
    setIsTracking(true);
    
    try {
      const location = await getCurrentLocation();
      setPickupLocation(location);
      setPermissionStatus('granted');
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

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <span className="text-sm">Pickup Location:</span>
          <span className="text-sm font-medium">
            {pickupLocation ? (
              <span className="text-green-600 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                Recorded
              </span>
            ) : (
              <span className="text-gray-400">Not set</span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <span className="text-sm">Delivery Location:</span>
          <span className="text-sm font-medium">
            {deliveryLocation ? (
              <span className="text-green-600 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                Recorded
              </span>
            ) : (
              <span className="text-gray-400">Not set</span>
            )}
          </span>
        </div>

        {calculatedDistance && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {calculatedDistance.toLocaleString()}m
              </div>
              <div className="text-sm text-green-600">
                Auto-calculated distance
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!isTracking && !pickupLocation && (
          <Button
            onClick={handleStartTracking}
            disabled={!isDeliveryActive || permissionStatus === 'denied'}
            className="flex-1 flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Start Tracking
          </Button>
        )}

        {isTracking && pickupLocation && !deliveryLocation && (
          <Button
            onClick={handleEndTracking}
            className="flex-1 flex items-center gap-2"
            variant="outline"
          >
            <Navigation className="h-4 w-4" />
            Mark Delivery Point
          </Button>
        )}

        {(pickupLocation || deliveryLocation) && (
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
          >
            Reset
          </Button>
        )}
      </div>

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
