
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';

export const useMonthManagement = (monthlyData: { [key: string]: any }, cashOnHand: number) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const queryClient = useQueryClient();

  const startNewMonth = () => {
    if (window.confirm('Are you sure you want to start a new month? This action cannot be undone.')) {
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      setCurrentMonth(nextMonth.toISOString().slice(0, 7));
    }
  };

  // Initialize current month data if it doesn't exist
  useEffect(() => {
    const initializeMonth = async () => {
      if (!monthlyData[currentMonth]) {
        console.log('Initializing month data for:', currentMonth);
        
        try {
          const { error } = await supabase
            .from('monthly_summary')
            .upsert({
              month: currentMonth,
              total_deliveries: 0,
              total_revenue: 0,
              total_profit: 0,
              total_discounts: 0,
              total_surcharges: 0,
              total_expenses: 0,
              net_income: 0,
              cash_on_hand_start: cashOnHand,
            }, {
              onConflict: 'month'
            });

          if (error) {
            console.error('Error initializing month:', error);
          } else {
            console.log('Month initialized successfully:', currentMonth);
            queryClient.invalidateQueries({ queryKey: ['monthly_summary'] });
          }
        } catch (error) {
          console.error('Exception during month initialization:', error);
        }
      }
    };

    initializeMonth();
  }, [currentMonth, cashOnHand, monthlyData, queryClient]);

  return {
    currentMonth,
    setCurrentMonth,
    startNewMonth
  };
};
