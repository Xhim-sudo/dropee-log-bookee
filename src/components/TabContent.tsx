
import React from 'react';
import { 
  CustomerMap, 
  Delivery, 
  MonthlyData, 
  DeliveryForm as DeliveryFormType, 
  ExpenseForm 
} from '../types/delivery';
import { FeeCalculation } from '../utils/deliveryCalculations';

// Import components
import DeliveryForm from './DeliveryForm';
import FeePreview from './FeePreview';
import CustomerList from './CustomerList';
import FinancialOverview from './FinancialOverview';
import RecentDeliveries from './RecentDeliveries';
import DataExport from './DataExport';

interface TabContentProps {
  activeTab: string;
  deliveryForm: DeliveryFormType;
  setDeliveryForm: (form: DeliveryFormType) => void;
  onProcessDelivery: () => void;
  feePreview: FeeCalculation;
  customers: CustomerMap;
  deliveries: Delivery[];
  currentMonthData: MonthlyData;
  expenseForm: ExpenseForm;
  setExpenseForm: (form: ExpenseForm) => void;
  onAddExpense: () => void;
  monthlyData: { [key: string]: MonthlyData };
  onStartNewMonth: () => void;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  deliveryForm,
  setDeliveryForm,
  onProcessDelivery,
  feePreview,
  customers,
  deliveries,
  currentMonthData,
  expenseForm,
  setExpenseForm,
  onAddExpense,
  monthlyData,
  onStartNewMonth
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {activeTab === 'calculator' && (
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
      )}

      {activeTab === 'customers' && (
        <CustomerList customers={customers} />
      )}

      {activeTab === 'reports' && (
        <div className="space-y-4 sm:space-y-6">
          <FinancialOverview
            currentMonthData={currentMonthData}
            expenseForm={expenseForm}
            setExpenseForm={setExpenseForm}
            onAddExpense={onAddExpense}
          />
          <RecentDeliveries deliveries={deliveries} />
        </div>
      )}

      {activeTab === 'export' && (
        <DataExport
          deliveries={deliveries}
          customers={customers}
          monthlyData={monthlyData}
          onStartNewMonth={onStartNewMonth}
        />
      )}
    </div>
  );
};

export default TabContent;
