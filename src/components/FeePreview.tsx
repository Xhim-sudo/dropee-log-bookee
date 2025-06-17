
import React from 'react';
import { FeeCalculation } from '../utils/deliveryCalculations';
import { DeliveryForm } from '../types/delivery';

interface FeePreviewProps {
  feePreview: FeeCalculation;
  deliveryForm: DeliveryForm;
}

const FeePreview: React.FC<FeePreviewProps> = ({ feePreview, deliveryForm }) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4">Live Calculation</h3>
      
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
        
        {/* Profit Calculation - Mobile Optimized */}
        <div className="pt-4 mt-4 border-t-2 border-dashed">
          <h4 className="text-base sm:text-xl font-bold text-gray-800 mb-2">Profit Projection</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Final Fee</span>
              <span className="font-medium">₹{feePreview.finalFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Fixed Costs (Fuel, Staff, etc.)</span>
              <span className="font-medium text-red-600">- ₹{feePreview.totalCosts.toFixed(2)}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 px-3 bg-blue-50 rounded-lg mt-2 space-y-1 sm:space-y-0">
              <span className="text-base sm:text-lg font-bold text-gray-800">Projected Profit:</span>
              <span className="text-lg sm:text-xl font-bold text-blue-600">₹{feePreview.profit.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeePreview;
