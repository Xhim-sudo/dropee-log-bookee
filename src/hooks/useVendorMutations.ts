
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { useToast } from './use-toast';
import { VendorForm } from '../types/vendor';

export const useVendorMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addVendorMutation = useMutation({
    mutationFn: async (vendorData: VendorForm) => {
      const { data, error } = await supabase
        .from('vendors')
        .insert([{
          name: vendorData.name,
          contact_person: vendorData.contact_person || null,
          phone: vendorData.phone || null,
          email: vendorData.email || null,
          address: vendorData.address,
          vendor_type: vendorData.vendor_type,
          rating: vendorData.rating ? parseFloat(vendorData.rating) : null,
          commission_rate: vendorData.commission_rate ? parseFloat(vendorData.commission_rate) : null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: "Vendor Added",
        description: "New vendor has been successfully added to the system.",
      });
    },
    onError: (error) => {
      toast({
        title: "Add Vendor Failed",
        description: `Failed to add vendor: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateVendorMutation = useMutation({
    mutationFn: async ({ id, ...vendorData }: VendorForm & { id: string }) => {
      const { data, error } = await supabase
        .from('vendors')
        .update({
          name: vendorData.name,
          contact_person: vendorData.contact_person || null,
          phone: vendorData.phone || null,
          email: vendorData.email || null,
          address: vendorData.address,
          vendor_type: vendorData.vendor_type,
          rating: vendorData.rating ? parseFloat(vendorData.rating) : null,
          commission_rate: vendorData.commission_rate ? parseFloat(vendorData.commission_rate) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: "Vendor Updated",
        description: "Vendor information has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Vendor Failed",
        description: `Failed to update vendor: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deactivateVendorMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      const { error } = await supabase
        .from('vendors')
        .update({ is_active: false })
        .eq('id', vendorId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: "Vendor Deactivated",
        description: "Vendor has been deactivated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Deactivate Vendor Failed",
        description: `Failed to deactivate vendor: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    addVendor: addVendorMutation.mutate,
    updateVendor: updateVendorMutation.mutate,
    deactivateVendor: deactivateVendorMutation.mutate,
    isAdding: addVendorMutation.isPending,
    isUpdating: updateVendorMutation.isPending,
    isDeactivating: deactivateVendorMutation.isPending,
  };
};
