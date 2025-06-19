
-- Create customers table to store customer information
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  order_count INTEGER NOT NULL DEFAULT 0,
  total_spent DECIMAL(10,2) NOT NULL DEFAULT 0,
  last_order_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, phone)
);

-- Create deliveries table to store delivery records
CREATE TABLE public.deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  order_description TEXT,
  distance_meters DECIMAL(10,2) NOT NULL,
  order_value DECIMAL(10,2) DEFAULT 0,
  weight_kg DECIMAL(10,2) DEFAULT 0,
  manual_discount_percent DECIMAL(5,2) DEFAULT 0,
  is_bad_weather BOOLEAN DEFAULT FALSE,
  is_off_hour BOOLEAN DEFAULT FALSE,
  is_fast_delivery BOOLEAN DEFAULT FALSE,
  distance_fee DECIMAL(10,2) NOT NULL,
  weather_surcharge DECIMAL(10,2) DEFAULT 0,
  off_hour_surcharge DECIMAL(10,2) DEFAULT 0,
  express_bonus DECIMAL(10,2) DEFAULT 0,
  weight_surcharge DECIMAL(10,2) DEFAULT 0,
  total_surcharges DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  auto_discount_amount DECIMAL(10,2) DEFAULT 0,
  auto_discount_type TEXT,
  final_fee DECIMAL(10,2) NOT NULL,
  total_costs DECIMAL(10,2) NOT NULL,
  profit DECIMAL(10,2) NOT NULL,
  month TEXT NOT NULL,
  delivery_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create monthly_summary table to store aggregated monthly data
CREATE TABLE public.monthly_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL UNIQUE,
  total_deliveries INTEGER NOT NULL DEFAULT 0,
  total_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_profit DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_discounts DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_surcharges DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_expenses DECIMAL(10,2) NOT NULL DEFAULT 0,
  net_income DECIMAL(10,2) NOT NULL DEFAULT 0,
  cash_on_hand_start DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expenses table to track monthly expenses
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  expense_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_deliveries_month ON public.deliveries(month);
CREATE INDEX idx_deliveries_customer_id ON public.deliveries(customer_id);
CREATE INDEX idx_deliveries_date ON public.deliveries(delivery_date);
CREATE INDEX idx_expenses_month ON public.expenses(month);
CREATE INDEX idx_customers_phone ON public.customers(phone);

-- Add Row Level Security (RLS) - Making tables public for now since no authentication is implemented
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for public access (since no auth is implemented)
CREATE POLICY "Public access to customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Public access to deliveries" ON public.deliveries FOR ALL USING (true);
CREATE POLICY "Public access to monthly_summary" ON public.monthly_summary FOR ALL USING (true);
CREATE POLICY "Public access to expenses" ON public.expenses FOR ALL USING (true);
