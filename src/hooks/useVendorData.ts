
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Vendor } from '../types/vendor';

export const useVendorData = () => {
  // Fetch vendors
  const { data: vendors = [], isLoading, error } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Vendor[];
    }
  });

  return {
    vendors,
    isLoading,
    error
  };
};
