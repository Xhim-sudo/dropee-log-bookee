
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Button } from './ui/button';

interface DeliveryTimerProps {
  onTimeUpdate?: (startTime: string | null, endTime: string | null, durationMinutes: number) => void;
  isDeliveryActive: boolean;
}

const DeliveryTimer: React.FC<DeliveryTimerProps> = ({ 
  onTimeUpdate, 
  isDeliveryActive 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [pausedDuration, setPausedDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pauseStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const actualElapsed = startTime 
          ? Math.floor((now - new Date(startTime).getTime() - pausedDuration) / 1000)
          : 0;
        setElapsedTime(actualElapsed);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, startTime, pausedDuration]);

  const handleStart = () => {
    const now = new Date().toISOString();
    setStartTime(now);
    setIsRunning(true);
    setIsPaused(false);
    setElapsedTime(0);
    setPausedDuration(0);
    onTimeUpdate?.(now, null, 0);
  };

  const handlePause = () => {
    if (!isPaused) {
      setIsPaused(true);
      pauseStartRef.current = Date.now();
    } else {
      setIsPaused(false);
      if (pauseStartRef.current) {
        setPausedDuration(prev => prev + (Date.now() - pauseStartRef.current!));
        pauseStartRef.current = null;
      }
    }
  };

  const handleStop = () => {
    const now = new Date().toISOString();
    setIsRunning(false);
    setIsPaused(false);
    
    if (startTime) {
      const finalDuration = Math.round(elapsedTime / 60); // Convert to minutes
      onTimeUpdate?.(startTime, now, finalDuration);
    }
    
    // Reset for next delivery
    setElapsedTime(0);
    setStartTime(null);
    setPausedDuration(0);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          Delivery Timer
        </h3>
        {isPaused && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            PAUSED
          </span>
        )}
      </div>
      
      <div className="text-center mb-4">
        <div className="text-3xl font-mono font-bold text-gray-800 mb-2">
          {formatTime(elapsedTime)}
        </div>
        {startTime && (
          <div className="text-sm text-gray-500">
            Started: {new Date(startTime).toLocaleTimeString()}
          </div>
        )}
      </div>
      
      <div className="flex gap-2 justify-center">
        {!isRunning ? (
          <Button
            onClick={handleStart}
            disabled={!isDeliveryActive}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Start Timer
          </Button>
        ) : (
          <>
            <Button
              onClick={handlePause}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              onClick={handleStop}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Complete
            </Button>
          </>
        )}
      </div>
      
      {!isDeliveryActive && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Fill delivery details to enable timer
        </p>
      )}
    </div>
  );
};

export default DeliveryTimer;
