
import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '../ui/button';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface TrackingControlsProps {
  isTracking: boolean;
  pickupLocation: Location | null;
  deliveryLocation: Location | null;
  isDeliveryActive: boolean;
  permissionStatus: 'unknown' | 'granted' | 'denied';
  onStartTracking: () => void;
  onEndTracking: () => void;
  onReset: () => void;
}

export const TrackingControls: React.FC<TrackingControlsProps> = ({
  isTracking,
  pickupLocation,
  deliveryLocation,
  isDeliveryActive,
  permissionStatus,
  onStartTracking,
  onEndTracking,
  onReset
}) => {
  return (
    <div className="flex gap-2">
      {!isTracking && !pickupLocation && (
        <Button
          onClick={onStartTracking}
          disabled={!isDeliveryActive || permissionStatus === 'denied'}
          className="flex-1 flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          Start Tracking
        </Button>
      )}

      {isTracking && pickupLocation && !deliveryLocation && (
        <Button
          onClick={onEndTracking}
          className="flex-1 flex items-center gap-2"
          variant="outline"
        >
          <Navigation className="h-4 w-4" />
          Mark Delivery Point
        </Button>
      )}

      {(pickupLocation || deliveryLocation) && (
        <Button
          onClick={onReset}
          variant="outline"
          size="sm"
        >
          Reset
        </Button>
      )}
    </div>
  );
};
