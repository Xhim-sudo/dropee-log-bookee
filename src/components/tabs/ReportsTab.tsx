
import React from 'react';
import { Delivery, MonthlyData, ExpenseForm } from '../../types/delivery';
import FinancialOverview from '../FinancialOverview';
import RecentDeliveries from '../RecentDeliveries';

interface ReportsTabProps {
  deliveries: Delivery[];
  currentMonthData: MonthlyData;
  expenseForm: ExpenseForm;
  setExpenseForm: (form: ExpenseForm) => void;
  onAddExpense: () => void;
}

const ReportsTab: React.FC<ReportsTabProps> = ({
  deliveries,
  currentMonthData,
  expenseForm,
  setExpenseForm,
  onAddExpense
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <FinancialOverview
        currentMonthData={currentMonthData}
        expenseForm={expenseForm}
        setExpenseForm={setExpenseForm}
        onAddExpense={onAddExpense}
      />
      <RecentDeliveries deliveries={deliveries} />
    </div>
  );
};

export default ReportsTab;
