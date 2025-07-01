
export interface Vendor {
  id: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string;
  vendor_type: string;
  rating: number | null;
  is_active: boolean | null;
  commission_rate: number | null;
  created_at: string;
  updated_at: string;
}

export interface VendorForm {
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  vendor_type: string;
  rating: string;
  commission_rate: string;
}

export type VendorType = 'restaurant' | 'grocery' | 'cafe' | 'electronics' | 'pharmacy' | 'other';

export const VENDOR_TYPES: { value: VendorType; label: string }[] = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'grocery', label: 'Grocery Store' },
  { value: 'cafe', label: 'Cafe/Coffee Shop' },
  { value: 'electronics', label: 'Electronics Store' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'other', label: 'Other' }
];
