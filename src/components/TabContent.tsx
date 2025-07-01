
import React from 'react';
import { 
  CustomerMap, 
  Delivery, 
  MonthlyData, 
  DeliveryForm as DeliveryFormType, 
  ExpenseForm 
} from '../types/delivery';
import { FeeCalculation } from '../utils/deliveryCalculations';

// Import tab components
import CalculatorTab from './tabs/CalculatorTab';
import CustomersTab from './tabs/CustomersTab';
import VendorsTab from './tabs/VendorsTab';
import ReportsTab from './tabs/ReportsTab';
import ExportTab from './tabs/ExportTab';

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
        <CalculatorTab
          deliveryForm={deliveryForm}
          setDeliveryForm={setDeliveryForm}
          onProcessDelivery={onProcessDelivery}
          feePreview={feePreview}
        />
      )}

      {activeTab === 'customers' && (
        <CustomersTab customers={customers} />
      )}

      {activeTab === 'vendors' && (
        <VendorsTab />
      )}

      {activeTab === 'reports' && (
        <ReportsTab
          deliveries={deliveries}
          currentMonthData={currentMonthData}
          expenseForm={expenseForm}
          setExpenseForm={setExpenseForm}
          onAddExpense={onAddExpense}
        />
      )}

      {activeTab === 'export' && (
        <ExportTab
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
