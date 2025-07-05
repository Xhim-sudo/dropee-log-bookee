
import { supabase } from '../integrations/supabase/client';
import { CustomerMap } from '../types/delivery';

export const upsertCustomer = async (
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  finalFee: number,
  customers: CustomerMap
) => {
  const customerId = `${customerName.toLowerCase().trim()}_${customerPhone}`;
  const existingCustomer = customers[customerId];
  
  console.log('Upserting customer:', { customerId, existingCustomer });
  
  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .upsert({
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
      order_count: (existingCustomer?.orderCount || 0) + 1,
      total_spent: (existingCustomer?.totalSpent || 0) + finalFee,
      last_order_date: new Date().toISOString(),
    }, { 
      onConflict: 'name,phone',
    })
    .select()
    .single();

  if (customerError) {
    console.error('Customer upsert error:', customerError);
    throw customerError;
  }

  console.log('Customer upserted successfully:', customerData);
  return customerData;
};
