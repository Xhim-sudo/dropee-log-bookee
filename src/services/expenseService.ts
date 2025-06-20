
import { supabase } from '../integrations/supabase/client';
import { ExpenseForm } from '../types/delivery';

export interface ExpenseRecord {
  description: string;
  amount: number;
  category: string;
}

export const processExpenseRecord = async (
  expense: ExpenseRecord,
  currentMonth: string
): Promise<ExpenseRecord> => {
  console.log('Adding expense:', expense);
  
  try {
    const { error } = await supabase
      .from('expenses')
      .insert({
        month: currentMonth,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
      });

    if (error) {
      console.error('Expense insert error:', error);
      throw error;
    }

    console.log('Expense inserted successfully');
    return expense;

  } catch (error) {
    console.error('Error in processExpenseRecord:', error);
    throw error;
  }
};

export const validateExpenseForm = (expenseForm: ExpenseForm): string | null => {
  const { description, amount } = expenseForm;
  
  if (!description.trim() || !amount) {
    return 'Please fill all expense fields';
  }

  const expenseAmount = parseFloat(amount);
  if (isNaN(expenseAmount) || expenseAmount <= 0) {
    return 'Please enter a valid expense amount';
  }
  
  return null;
};

export const createExpenseRecord = (expenseForm: ExpenseForm): ExpenseRecord => {
  console.log('Creating expense record from form:', expenseForm);
  
  const validationError = validateExpenseForm(expenseForm);
  if (validationError) {
    console.error('Validation error:', validationError);
    throw new Error(validationError);
  }
  
  return {
    description: expenseForm.description,
    amount: parseFloat(expenseForm.amount),
    category: expenseForm.category
  };
};
