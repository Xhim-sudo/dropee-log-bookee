
-- Add new columns to deliveries table for tiered pricing
ALTER TABLE public.deliveries 
ADD COLUMN distance_tier TEXT,
ADD COLUMN base_tier_fee DECIMAL(10,2),
ADD COLUMN excess_distance_meters DECIMAL(10,2) DEFAULT 0,
ADD COLUMN excess_distance_fee DECIMAL(10,2) DEFAULT 0,
ADD COLUMN is_essential_mode BOOLEAN DEFAULT FALSE,
ADD COLUMN essential_mode_discount DECIMAL(10,2) DEFAULT 0;

-- Create index for better performance on distance tier queries
CREATE INDEX idx_deliveries_distance_tier ON public.deliveries(distance_tier);
CREATE INDEX idx_deliveries_essential_mode ON public.deliveries(is_essential_mode);

-- Add new pricing configuration table for flexibility
CREATE TABLE public.pricing_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_name TEXT NOT NULL UNIQUE,
  tier_1_max_meters INTEGER NOT NULL DEFAULT 3000,
  tier_1_rate DECIMAL(10,4) NOT NULL DEFAULT 0.0400,
  tier_2_max_meters INTEGER NOT NULL DEFAULT 7000,
  tier_2_rate DECIMAL(10,4) NOT NULL DEFAULT 0.0500,
  tier_3_rate DECIMAL(10,4) NOT NULL DEFAULT 0.0635,
  essential_discount_percent DECIMAL(5,2) NOT NULL DEFAULT 20.0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default pricing configuration
INSERT INTO public.pricing_config (
  config_name, 
  tier_1_max_meters, 
  tier_1_rate, 
  tier_2_max_meters, 
  tier_2_rate, 
  tier_3_rate, 
  essential_discount_percent
) VALUES (
  'default',
  3000,
  0.0400,
  7000,
  0.0500,
  0.0635,
  20.0
);

-- Enable RLS on pricing_config table
ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access to pricing_config" ON public.pricing_config FOR ALL USING (true);
