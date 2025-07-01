
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { useToast } from './use-toast';

export const useDataOperations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerKey: string) => {
      const [name, phone] = customerKey.split('_');
      const customerName = name.replace(/\b\w/g, l => l.toUpperCase()).replace(/-/g, ' ');
      
      // Delete customer record
      const { error: customerError } = await supabase
        .from('customers')
        .delete()
        .eq('name', customerName)
        .eq('phone', phone);

      if (customerError) throw customerError;

      // Delete associated deliveries
      const { error: deliveryError } = await supabase
        .from('deliveries')
        .delete()
        .eq('customer_name', customerName)
        .eq('customer_phone', phone);

      if (deliveryError) throw deliveryError;

      return { customerName, phone };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['monthly_summary'] });
      
      toast({
        title: "Customer Deleted",
        description: `${data.customerName} and all associated deliveries have been removed.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: `Failed to delete customer: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const clearAllDataMutation = useMutation({
    mutationFn: async () => {
      // Clear all data in the correct order (due to foreign key constraints)
      const { error: deliveriesError } = await supabase
        .from('deliveries')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (deliveriesError) throw deliveriesError;

      const { error: customersError } = await supabase
        .from('customers')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (customersError) throw customersError;

      const { error: expensesError } = await supabase
        .from('expenses')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (expensesError) throw expensesError;

      const { error: monthlyError } = await supabase
        .from('monthly_summary')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (monthlyError) throw monthlyError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['monthly_summary'] });
      
      toast({
        title: "All Data Cleared",
        description: "All delivery, customer, expense, and monthly data has been cleared. Ready for June!",
      });
    },
    onError: (error) => {
      toast({
        title: "Clear Data Failed",
        description: `Failed to clear data: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    deleteCustomer: deleteCustomerMutation.mutate,
    clearAllData: clearAllDataMutation.mutate,
    isDeleting: deleteCustomerMutation.isPending,
    isClearing: clearAllDataMutation.isPending,
  };
};
