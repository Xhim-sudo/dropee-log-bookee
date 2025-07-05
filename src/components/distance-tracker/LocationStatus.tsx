
import React from 'react';
import { MapPin } from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface LocationStatusProps {
  pickupLocation: Location | null;
  deliveryLocation: Location | null;
  calculatedDistance: number | null;
}

export const LocationStatus: React.FC<LocationStatusProps> = ({
  pickupLocation,
  deliveryLocation,
  calculatedDistance
}) => {
  return (
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
  );
};
