
import React from 'react';
import { FeeCalculation } from '../utils/deliveryCalculations';
import { DeliveryForm } from '../types/delivery';

interface FeePreviewProps {
  feePreview: FeeCalculation;
  deliveryForm: DeliveryForm;
}

const FeePreview: React.FC<FeePreviewProps> = ({ feePreview, deliveryForm }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Live Calculation</h3>
      
      <div className="space-y-3">
        {/* Base Fee */}
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Distance Fee ({feePreview.distanceKm} km)</span>
          <span className="font-medium">₹{feePreview.distanceFee.toFixed(2)}</span>
        </div>

        {/* Surcharges */}
        {(feePreview.totalSurcharges > 0 || feePreview.expressBonus > 0) && (
          <div className="py-2 border-b">
            <span className="text-gray-600 font-medium">Surcharges & Bonuses</span>
            {feePreview.weatherSurcharge > 0 && <div className="flex justify-between text-sm mt-1"><span className="text-gray-500 pl-2">› Bad Weather</span><span className="font-medium text-amber-600">+ ₹{feePreview.weatherSurcharge.toFixed(2)}</span></div>}
            {feePreview.offHourSurcharge > 0 && <div className="flex justify-between text-sm mt-1"><span className="text-gray-500 pl-2">› Off-Hour</span><span className="font-medium text-amber-600">+ ₹{feePreview.offHourSurcharge.toFixed(2)}</span></div>}
            {feePreview.weightSurcharge > 0 && <div className="flex justify-between text-sm mt-1"><span className="text-gray-500 pl-2">› Overweight</span><span className="font-medium text-amber-600">+ ₹{feePreview.weightSurcharge.toFixed(2)}</span></div>}
            {feePreview.expressBonus > 0 && <div className="flex justify-between text-sm mt-1"><span className="text-gray-500 pl-2">› Express Bonus</span><span className="font-medium text-amber-600">+ ₹{feePreview.expressBonus.toFixed(2)}</span></div>}
          </div>
        )}
        
        {/* Discounts */}
        {(feePreview.discountAmount > 0 || feePreview.autoDiscountAmount > 0) && (
          <div className="py-2 border-b">
            <span className="text-gray-600 font-medium">Discounts</span>
            {feePreview.discountAmount > 0 && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500 pl-2">› Manual ({deliveryForm.manualDiscountPercent || 0}%)</span>
                <span className="font-medium text-red-600">- ₹{feePreview.discountAmount.toFixed(2)}</span>
              </div>
            )}
            {feePreview.autoDiscountAmount > 0 && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500 pl-2">› {feePreview.autoDiscountType}</span>
                <span className="font-medium text-green-600">- ₹{feePreview.autoDiscountAmount.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        {/* Final Fee */}
        <div className="flex justify-between items-center py-3 text-lg font-bold bg-gray-50 px-3 rounded-lg mt-4">
          <span>Final Delivery Fee:</span>
          <span className="text-green-600 text-2xl">₹{feePreview.finalFee.toFixed(2)}</span>
        </div>
        
        {/* Profit Calculation */}
        <div className="pt-4 mt-4 border-t-2 border-dashed">
          <h4 className="text-xl font-bold text-gray-800 mb-2">Profit Projection</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Final Fee</span>
              <span className="font-medium">₹{feePreview.finalFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fixed Costs (Fuel, Staff, etc.)</span>
              <span className="font-medium text-red-600">- ₹{feePreview.totalCosts.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 text-lg font-bold bg-blue-50 px-3 rounded-lg mt-2">
              <span>Projected Profit:</span>
              <span className="text-blue-600 text-xl">₹{feePreview.profit.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeePreview;
