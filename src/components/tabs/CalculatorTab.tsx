
import React from 'react';
import { DeliveryForm as DeliveryFormType } from '../../types/delivery';
import { FeeCalculation } from '../../utils/deliveryCalculations';
import DeliveryForm from '../DeliveryForm';
import FeePreview from '../FeePreview';

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
  return (
    <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
      <DeliveryForm
        deliveryForm={deliveryForm}
        setDeliveryForm={setDeliveryForm}
        onProcessDelivery={onProcessDelivery}
      />
      <FeePreview
        feePreview={feePreview}
        deliveryForm={deliveryForm}
      />
    </div>
  );
};

export default CalculatorTab;
