
-- Add vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT NOT NULL,
  vendor_type TEXT NOT NULL DEFAULT 'restaurant',
  rating DECIMAL(3,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  commission_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, phone)
);

-- Add new columns to deliveries table for enhanced tracking
ALTER TABLE public.deliveries 
ADD COLUMN vendor_id UUID REFERENCES public.vendors(id),
ADD COLUMN pickup_latitude DECIMAL(10,8),
ADD COLUMN pickup_longitude DECIMAL(11,8),
ADD COLUMN delivery_latitude DECIMAL(10,8),
ADD COLUMN delivery_longitude DECIMAL(11,8),
ADD COLUMN start_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN end_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN duration_minutes INTEGER,
ADD COLUMN is_defective BOOLEAN DEFAULT FALSE,
ADD COLUMN auto_distance_meters DECIMAL(10,2),
ADD COLUMN distance_source TEXT DEFAULT 'manual',
ADD COLUMN performance_score DECIMAL(5,2);

-- Create indexes for better performance
CREATE INDEX idx_vendors_active ON public.vendors(is_active);
CREATE INDEX idx_vendors_type ON public.vendors(vendor_type);
CREATE INDEX idx_deliveries_vendor_id ON public.deliveries(vendor_id);
CREATE INDEX idx_deliveries_performance ON public.deliveries(performance_score);
CREATE INDEX idx_deliveries_defective ON public.deliveries(is_defective);

-- Add Row Level Security for vendors table
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access to vendors" ON public.vendors FOR ALL USING (true);

-- Add sample vendors data
INSERT INTO public.vendors (name, contact_person, phone, email, address, vendor_type, rating, commission_rate) VALUES
('Mumbai Spice Kitchen', 'Raj Patel', '+91-98765-43210', 'raj@mumbaispace.com', '123 Food Street, Andheri, Mumbai', 'restaurant', 4.5, 15.0),
('Quick Bites Express', 'Priya Sharma', '+91-87654-32109', 'priya@quickbites.com', '456 Fast Lane, Bandra, Mumbai', 'restaurant', 4.2, 12.0),
('Fresh Mart Grocery', 'Amit Kumar', '+91-76543-21098', 'amit@freshmart.com', '789 Market Road, Powai, Mumbai', 'grocery', 4.0, 8.0),
('Cafe Coffee Day', 'Sneha Gupta', '+91-65432-10987', 'sneha@ccd.com', '321 Coffee Corner, Juhu, Mumbai', 'cafe', 3.8, 10.0),
('Electronics Zone', 'Vikram Singh', '+91-54321-09876', 'vikram@electronics.com', '654 Tech Plaza, Lower Parel, Mumbai', 'electronics', 4.1, 5.0);
