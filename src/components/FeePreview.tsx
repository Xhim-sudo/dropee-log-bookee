
import React from 'react';
import { FeeCalculation } from '../utils/deliveryCalculations';
import { DeliveryForm } from '../types/delivery';
import { useVendorData } from '../hooks/useVendorData';
import { Building2, TrendingUp, TrendingDown } from 'lucide-react';

interface FeePreviewProps {
  feePreview: FeeCalculation;
  deliveryForm: DeliveryForm;
  autoDistance?: number;
  timerDuration?: number;
}

const FeePreview: React.FC<FeePreviewProps> = ({ 
  feePreview, 
  deliveryForm, 
  autoDistance,
  timerDuration 
}) => {
  const { vendors } = useVendorData();
  const selectedVendor = vendors.find(v => v.id === deliveryForm.vendorId);
  
  // Enhanced profit calculation with variable costs
  const baseCosts = feePreview.totalCosts;
  const variableCosts = {
    low: baseCosts * 0.8,  // 20% savings on efficient delivery
    high: baseCosts * 1.4  // 40% increase on difficult delivery
  };
  
  const profitRange = {
    low: feePreview.finalFee - variableCosts.high,
    high: feePreview.finalFee - variableCosts.low
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4">Live Calculation</h3>
      
      {/* Vendor Information */}
      {selectedVendor && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Building2 className="h-4 w-4 mr-2 text-blue-600" />
            <div>
              <div className="font-medium text-blue-800">{selectedVendor.name}</div>
              <div className="text-xs text-blue-600 capitalize">{selectedVendor.vendor_type}</div>
            </div>
          </div>
        </div>
      )}

      {/* Distance Comparison */}
      {autoDistance && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-2">Distance Comparison</h4>
          <div className="flex justify-between text-sm">
            <span>Manual: {deliveryForm.distanceMeters}m</span>
            <span>Auto: {autoDistance}m</span>
            <span className={`font-medium ${
              autoDistance > parseInt(deliveryForm.distanceMeters) ? 'text-red-600' : 'text-green-600'
            }`}>
              {autoDistance > parseInt(deliveryForm.distanceMeters) ? '+' : ''}
              {autoDistance - parseInt(deliveryForm.distanceMeters)}m
            </span>
          </div>
        </div>
      )}

      {/* Timer Information */}
      {timerDuration && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-purple-800">Delivery Time</span>
            <span className="text-sm text-purple-600">{timerDuration} minutes</span>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {/* Base Fee */}
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-sm sm:text-base text-gray-600">Distance Fee ({feePreview.distanceKm} km)</span>
          <span className="font-medium text-sm sm:text-base">₹{feePreview.distanceFee.toFixed(2)}</span>
        </div>

        {/* Surcharges */}
        {(feePreview.totalSurcharges > 0 || feePreview.expressBonus > 0) && (
          <div className="py-2 border-b">
            <span className="text-sm sm:text-base text-gray-600 font-medium">Surcharges & Bonuses</span>
            <div className="mt-2 space-y-1">
              {feePreview.weatherSurcharge > 0 && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500 pl-2">› Bad Weather</span>
                  <span className="font-medium text-amber-600">+ ₹{feePreview.weatherSurcharge.toFixed(2)}</span>
                </div>
              )}
              {feePreview.offHourSurcharge > 0 && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500 pl-2">› Off-Hour</span>
                  <span className="font-medium text-amber-600">+ ₹{feePreview.offHourSurcharge.toFixed(2)}</span>
                </div>
              )}
              {feePreview.weightSurcharge > 0 && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500 pl-2">› Overweight</span>
                  <span className="font-medium text-amber-600">+ ₹{feePreview.weightSurcharge.toFixed(2)}</span>
                </div>
              )}
              {feePreview.expressBonus > 0 && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500 pl-2">› Express Bonus</span>
                  <span className="font-medium text-amber-600">+ ₹{feePreview.expressBonus.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Discounts */}
        {(feePreview.discountAmount > 0 || feePreview.autoDiscountAmount > 0) && (
          <div className="py-2 border-b">
            <span className="text-sm sm:text-base text-gray-600 font-medium">Discounts</span>
            <div className="mt-2 space-y-1">
              {feePreview.discountAmount > 0 && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500 pl-2">› Manual ({deliveryForm.manualDiscountPercent || 0}%)</span>
                  <span className="font-medium text-red-600">- ₹{feePreview.discountAmount.toFixed(2)}</span>
                </div>
              )}
              {feePreview.autoDiscountAmount > 0 && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500 pl-2 break-words">› {feePreview.autoDiscountType}</span>
                  <span className="font-medium text-green-600 whitespace-nowrap">- ₹{feePreview.autoDiscountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Final Fee - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-3 bg-gray-50 rounded-lg mt-4 space-y-1 sm:space-y-0">
          <span className="text-base sm:text-lg font-bold text-gray-800">Final Delivery Fee:</span>
          <span className="text-xl sm:text-2xl font-bold text-green-600">₹{feePreview.finalFee.toFixed(2)}</span>
        </div>
        
        {/* Enhanced Profit Calculation - Mobile Optimized */}
        <div className="pt-4 mt-4 border-t-2 border-dashed">
          <h4 className="text-base sm:text-xl font-bold text-gray-800 mb-2">Enhanced Profit Analysis</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Final Fee</span>
              <span className="font-medium">₹{feePreview.finalFee.toFixed(2)}</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Variable Costs (Efficient)</span>
                <span className="font-medium text-green-600">- ₹{variableCosts.low.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Variable Costs (Standard)</span>
                <span className="font-medium text-orange-600">- ₹{baseCosts.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Variable Costs (Difficult)</span>
                <span className="font-medium text-red-600">- ₹{variableCosts.high.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Profit Range Display */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg mt-3 space-y-2 sm:space-y-0">
              <span className="text-base sm:text-lg font-bold text-gray-800">Projected Profit Range:</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {profitRange.low < feePreview.profit ? (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  )}
                  <span className="text-lg sm:text-xl font-bold text-blue-600">
                    ₹{Math.max(0, profitRange.low).toFixed(0)} - ₹{Math.max(0, profitRange.high).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              <p>• Efficient delivery: Good weather, short distance, no delays</p>
              <p>• Difficult delivery: Bad weather, traffic, multiple attempts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeePreview;
