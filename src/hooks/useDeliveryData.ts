
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { CustomerMap, Delivery, MonthlyData } from '../types/delivery';
import { transformCustomersData, transformDeliveriesData, transformMonthlyData } from '../utils/dataTransformers';

export const useDeliveryData = () => {
  // Fetch customers
  const { data: customersData = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch deliveries
  const { data: deliveriesData = [] } = useQuery({
    queryKey: ['deliveries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deliveries')
        .select('*')
        .order('delivery_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch monthly summary
  const { data: monthlyData = {} } = useQuery({
    queryKey: ['monthly_summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_summary')
        .select('*');
      
      if (error) throw error;
      
      return transformMonthlyData(data, deliveriesData);
    }
  });

  // Transform data using utility functions
  const customers: CustomerMap = transformCustomersData(customersData);
  const deliveries: Delivery[] = transformDeliveriesData(deliveriesData);

  return {
    customers,
    deliveries,
    monthlyData,
    customersData,
    deliveriesData
  };
};
