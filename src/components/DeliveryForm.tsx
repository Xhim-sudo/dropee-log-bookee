
import React from 'react';
import { Calculator, Package } from 'lucide-react';
import { DeliveryForm as DeliveryFormType } from '../types/delivery';
import { VendorSelector } from './delivery-form/VendorSelector';
import { CustomerInfoFields } from './delivery-form/CustomerInfoFields';
import { OrderDetailsFields } from './delivery-form/OrderDetailsFields';
import { SurchargeToggles } from './delivery-form/SurchargeToggles';

interface DeliveryFormProps {
  deliveryForm: DeliveryFormType;
  setDeliveryForm: React.Dispatch<React.SetStateAction<DeliveryFormType>>;
  onProcessDelivery: () => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({
  deliveryForm,
  setDeliveryForm,
  onProcessDelivery
}) => {
  const handleFormChange = (updates: Partial<DeliveryFormType>) => {
    setDeliveryForm(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
        <Calculator className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-indigo-600" />
        <span className="text-sm sm:text-base">New Delivery Order</span>
      </h2>
      
      <div className="space-y-4">
        <VendorSelector
          vendorId={deliveryForm.vendorId}
          onVendorChange={(vendorId) => handleFormChange({ vendorId })}
        />

        <CustomerInfoFields
          deliveryForm={deliveryForm}
          onFormChange={handleFormChange}
        />
        
        <OrderDetailsFields
          deliveryForm={deliveryForm}
          onFormChange={handleFormChange}
        />

        <SurchargeToggles
          deliveryForm={deliveryForm}
          onFormChange={handleFormChange}
        />

        <div className="pt-4">
          <button 
            onClick={onProcessDelivery} 
            className="w-full bg-indigo-600 text-white py-4 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 shadow-sm text-base touch-manipulation"
          >
            <Package className="h-5 w-5" />
            <span>Process Delivery & Calculate Fee</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryForm;
