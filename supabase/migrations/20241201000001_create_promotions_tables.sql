
-- Create promotions table if it doesn't exist with proper structure
CREATE TABLE IF NOT EXISTS public.promotions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  discount numeric NOT NULL,
  discount_type text NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  description text,
  min_purchase_amount numeric DEFAULT 0,
  max_discount numeric,
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  usage_limit integer,
  usage_count integer DEFAULT 0,
  target text DEFAULT 'all' CHECK (target IN ('all', 'ya-ba-boss')),
  
  -- Advanced features
  usage_type text DEFAULT 'unlimited' CHECK (usage_type IN ('unlimited', 'limited', 'single_use')),
  max_uses_per_user integer,
  target_cities text[],
  target_categories text[],
  customer_history_requirement jsonb,
  is_combinable boolean DEFAULT false,
  combination_rules jsonb,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create promotion usage tracking table
CREATE TABLE IF NOT EXISTS public.promotion_usage (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  promotion_id uuid REFERENCES public.promotions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  order_id uuid,
  used_at timestamptz DEFAULT now(),
  discount_applied numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_promotions_code ON public.promotions(code);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON public.promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON public.promotions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_promotion_usage_promotion ON public.promotion_usage(promotion_id);
CREATE INDEX IF NOT EXISTS idx_promotion_usage_user ON public.promotion_usage(user_id);

-- Enable RLS
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for promotions
CREATE POLICY "Promotions are viewable by everyone" ON public.promotions
  FOR SELECT USING (true);

CREATE POLICY "Promotions are insertable by authenticated users" ON public.promotions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Promotions are updatable by authenticated users" ON public.promotions
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Promotions are deletable by authenticated users" ON public.promotions
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create RLS policies for promotion usage
CREATE POLICY "Promotion usage is viewable by owner" ON public.promotion_usage
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  ));

CREATE POLICY "Promotion usage is insertable by authenticated users" ON public.promotion_usage
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Insert some default promotions if they don't exist
INSERT INTO public.promotions (code, discount, discount_type, description, start_date, end_date, is_active, target)
VALUES 
  ('SUMMER2024', 20, 'percentage', 'Promotion d''été - 20% de réduction', '2024-05-01', '2024-06-30', true, 'all'),
  ('WELCOME10', 10, 'percentage', 'Promotion de bienvenue - 10% de réduction', '2024-01-01', '2024-12-31', true, 'all'),
  ('FLASH50', 50, 'percentage', 'Offre flash - 50% de réduction', '2024-04-01', '2024-04-30', false, 'all')
ON CONFLICT (code) DO NOTHING;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_promotions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_promotions_updated_at
  BEFORE UPDATE ON public.promotions
  FOR EACH ROW
  EXECUTE FUNCTION update_promotions_updated_at();
